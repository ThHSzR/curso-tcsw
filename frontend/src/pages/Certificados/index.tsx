import { useEffect, useState } from 'react';
import type { Certificado } from '../../services/certificadoService';
import { certificadoService } from '../../services/certificadoService';
import { usuarioService } from '../../services/usuarioService';
import type { Usuario } from '../../services/usuarioService';
import { cursoService } from '../../services/cursoService';
import type { Curso } from '../../services/cursoService';
import { trilhaService } from '../../services/trilhaService';
import type { Trilha } from '../../services/trilhaService';

function gerarCodigo() {
  return 'CERT-' + new Date().getFullYear() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
}

export function Certificados() {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [form, setForm] = useState<Omit<Certificado, 'id'>>({
    usuarioId: 0, cursoId: 0, trilhaId: null,
    codigoVerificacao: gerarCodigo(),
    dataEmissao: new Date().toISOString().split('T')[0],
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([certificadoService.getAll(), usuarioService.getAll(), cursoService.getAll(), trilhaService.getAll()])
      .then(([c, u, cu, t]) => { setCertificados(c); setUsuarios(u); setCursos(cu); setTrilhas(t); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) { await certificadoService.update(editId, form); }
    else { await certificadoService.create({ ...form, codigoVerificacao: gerarCodigo() }); }
    setForm({ usuarioId: 0, cursoId: 0, trilhaId: null, codigoVerificacao: gerarCodigo(), dataEmissao: new Date().toISOString().split('T')[0] });
    setEditId(null); load();
  };

  const handleEdit = (c: Certificado) => {
    setForm({ usuarioId: c.usuarioId, cursoId: c.cursoId, trilhaId: c.trilhaId, codigoVerificacao: c.codigoVerificacao, dataEmissao: c.dataEmissao });
    setEditId(c.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este certificado?')) return;
    await certificadoService.remove(id); load();
  };

  const nomeUsuario = (id: number) => usuarios.find(u => u.id === id)?.nomeCompleto ?? `#${id}`;
  const nomeCurso = (id: number) => cursos.find(c => c.id === id)?.titulo ?? `#${id}`;
  const nomeTrilha = (id: number | null) => id ? (trilhas.find(t => t.id === id)?.titulo ?? `#${id}`) : '—';

  return (
    <div className="page-container">
      <div className="page-header"><h2>Certificados</h2></div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">{editId ? 'Editar Certificado' : 'Emitir Certificado'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Usuário</label>
                <select className="form-select" value={form.usuarioId} onChange={e => setForm({ ...form, usuarioId: +e.target.value })} required>
                  <option value={0}>Selecione...</option>
                  {usuarios.map(u => <option key={u.id} value={u.id}>{u.nomeCompleto}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Curso</label>
                <select className="form-select" value={form.cursoId} onChange={e => setForm({ ...form, cursoId: +e.target.value })} required>
                  <option value={0}>Selecione...</option>
                  {cursos.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Trilha (opcional)</label>
                <select className="form-select" value={form.trilhaId ?? ''} onChange={e => setForm({ ...form, trilhaId: e.target.value ? +e.target.value : null })}>
                  <option value="">Nenhuma</option>
                  {trilhas.map(t => <option key={t.id} value={t.id}>{t.titulo}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Data de Emissão</label>
                <input type="date" className="form-control" value={form.dataEmissao} onChange={e => setForm({ ...form, dataEmissao: e.target.value })} required />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary">{editId ? 'Salvar' : 'Emitir'}</button>
              {editId && <button type="button" className="btn btn-secondary" onClick={() => { setForm({ usuarioId: 0, cursoId: 0, trilhaId: null, codigoVerificacao: gerarCodigo(), dataEmissao: new Date().toISOString().split('T')[0] }); setEditId(null); }}>Cancelar</button>}
            </div>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead>
                <tr><th>#</th><th>Usuário</th><th>Curso</th><th>Trilha</th><th>Código</th><th>Emissão</th><th style={{ width: 100 }}>Ações</th></tr>
              </thead>
              <tbody>
                {certificados.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{nomeUsuario(c.usuarioId)}</td>
                    <td>{nomeCurso(c.cursoId)}</td>
                    <td>{nomeTrilha(c.trilhaId)}</td>
                    <td><code>{c.codigoVerificacao}</code></td>
                    <td>{c.dataEmissao}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(c)}><i className="bi bi-pencil" /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id)}><i className="bi bi-trash" /></button>
                    </td>
                  </tr>
                ))}
                {certificados.length === 0 && <tr><td colSpan={7} className="text-center text-muted py-4">Nenhum certificado emitido.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
