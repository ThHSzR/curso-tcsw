export function SGCursos() {
  const items = [
    { label: 'Total de matrículas', value: '1.204', trend: '+12%', icon: 'bi-person-check', color: 'var(--primary)' },
    { label: 'Receita mensal',      value: 'R$ 18.450', trend: '+8%', icon: 'bi-currency-dollar', color: 'var(--success)' },
    { label: 'Cursos ativos',       value: '12',   trend: '+2',  icon: 'bi-mortarboard',  color: 'var(--info)' },
    { label: 'Taxa de conclusão',   value: '68%',  trend: '+3%', icon: 'bi-trophy',       color: 'var(--warning)' },
  ];

  const recent = [
    { nome: 'React do Zero',     alunos: 342, status: 'Ativo',    nivel: 'Iniciante' },
    { nome: 'Figma Avançado',    alunos: 198, status: 'Ativo',    nivel: 'Avançado' },
    { nome: 'Node.js com APIs',  alunos: 287, status: 'Ativo',    nivel: 'Intermediário' },
    { nome: 'SQL na Prática',    alunos: 156, status: 'Rascunho', nivel: 'Iniciante' },
    { nome: 'UX Design',         alunos: 221, status: 'Ativo',    nivel: 'Intermediário' },
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
        {items.map(i => (
          <div className="stat-card" key={i.label}>
            <div className="stat-icon" style={{ background: 'var(--surface-3)', color: i.color }}>
              <i className={`bi ${i.icon}`}></i>
            </div>
            <div>
              <div className="stat-value">{i.value}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:4 }}>
                <span style={{ fontSize:11, color:'var(--text-muted)' }}>{i.label}</span>
                <span style={{ fontSize:11, color:'var(--success)', background:'var(--success-light)', padding:'1px 6px', borderRadius:99 }}>{i.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <span className="table-toolbar-title">Cursos mais populares</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Curso</th>
              <th>Alunos</th>
              <th>Nível</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map(r => (
              <tr key={r.nome}>
                <td style={{ fontWeight: 500 }}>{r.nome}</td>
                <td className="td-muted">{r.alunos}</td>
                <td><span className="badge badge-muted">{r.nivel}</span></td>
                <td><span className={`badge ${r.status === 'Ativo' ? 'badge-success' : 'badge-warning'}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
