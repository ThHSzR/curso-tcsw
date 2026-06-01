import { useState, useEffect } from 'react';
import { cursoService }      from '../../services/cursoService';
import type { Curso }        from '../../services/cursoService';
import { matriculaService }  from '../../services/matriculaService';
import { assinaturaService } from '../../services/assinaturaService';
import { certificadoService } from '../../services/certificadoService';
import { nivelService }      from '../../services/nivelService';

export function SGCursos() {
  const [cursos, setCursos]         = useState<Curso[]>([]);
  const [totalMatriculas, setTotalMatriculas] = useState(0);
  const [receitaMensal, setReceitaMensal]     = useState(0);
  const [taxaConclusao, setTaxaConclusao]     = useState(0);
  const [niveis, setNiveis]         = useState<{id:number; nome:string}[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [cs, matriculas, assinaturas, certs, nvs] = await Promise.all([
          cursoService.getAll(),
          matriculaService.getAll(),
          assinaturaService.getAll(),
          certificadoService.getAll(),
          nivelService.getAll(),
        ]);

        setCursos(cs);
        setNiveis(nvs);
        setTotalMatriculas(matriculas.length);

        // receita = soma dos precos dos planos das assinaturas ativas
        const { planoService } = await import('../../services/assinaturaService');
        const planos = await planoService.getAll();
        const ativas = assinaturas.filter((a: { status: string }) => a.status === 'ativa');
        const receita = ativas.reduce((acc: number, a: { planoId: number }) => {
          const plano = planos.find((p: { id: number; preco: number }) => p.id === a.planoId);
          return acc + (plano?.preco ?? 0);
        }, 0);
        setReceitaMensal(receita);

        // taxa de conclusao = matriculas com progresso 100% / total
        const concluidas = matriculas.filter((m: { progresso: number }) => m.progresso === 100).length;
        setTaxaConclusao(matriculas.length > 0 ? Math.round((concluidas / matriculas.length) * 100) : 0);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getNivel = (nivelId: number) => niveis.find(n => n.id === nivelId)?.nome ?? '-';

  const kpis = [
    { label: 'Total de matrículas', value: loading ? '—' : String(totalMatriculas),                  icon: 'bi-person-check',     color: 'var(--primary)' },
    { label: 'Receita (assinaturas ativas)', value: loading ? '—' : `R$ ${receitaMensal.toFixed(2)}`,  icon: 'bi-currency-dollar',  color: 'var(--success)' },
    { label: 'Cursos cadastrados',  value: loading ? '—' : String(cursos.length),                      icon: 'bi-mortarboard',      color: 'var(--info)' },
    { label: 'Taxa de conclusão',   value: loading ? '—' : `${taxaConclusao}%`,                       icon: 'bi-trophy',           color: 'var(--warning)' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Visão Geral</h1>
          <p className="page-subtitle">Métricas e resumo da plataforma</p>
        </div>
      </div>

      <div className="stat-grid" style={{ marginBottom: 24 }}>
        {kpis.map(i => (
          <div className="stat-card" key={i.label}>
            <div className="stat-icon" style={{ background: 'var(--surface-3)', color: i.color }}>
              <i className={`bi ${i.icon}`}></i>
            </div>
            <div>
              <div className="stat-value">{i.value}</div>
              <div style={{ marginTop: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{i.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <span className="table-toolbar-title">Cursos cadastrados</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Curso</th>
              <th>Carga Horária</th>
              <th>Nível</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <tr><td colSpan={3} className="table-empty"><i className="bi bi-arrow-repeat"></i><p>Carregando...</p></td></tr>
              : cursos.length === 0
                ? <tr><td colSpan={3} className="table-empty"><i className="bi bi-inbox"></i><p>Nenhum curso</p></td></tr>
                : cursos.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.nome}</td>
                    <td className="td-muted">{c.cargaHoraria}h</td>
                    <td><span className="badge badge-muted">{getNivel(c.nivelId)}</span></td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
