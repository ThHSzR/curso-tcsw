import { NavLink } from 'react-router-dom';

const stats = [
  { label: 'Trilhas',       value: '4',  icon: 'bi-signpost-split', color: 'var(--primary)',  bg: 'var(--primary-light)' },
  { label: 'Cursos',        value: '12', icon: 'bi-mortarboard',    color: 'var(--info)',     bg: 'var(--info-light)' },
  { label: 'Módulos',       value: '38', icon: 'bi-collection',     color: 'var(--success)',  bg: 'var(--success-light)' },
  { label: 'Aulas',         value: '96', icon: 'bi-play-circle',    color: 'var(--warning)',  bg: 'var(--warning-light)' },
  { label: 'Usuários',      value: '247',icon: 'bi-people',         color: 'var(--primary)',  bg: 'var(--primary-light)' },
  { label: 'Certificados',  value: '89', icon: 'bi-patch-check',    color: 'var(--success)',  bg: 'var(--success-light)' },
];

const shortcuts = [
  { to: '/trilhas',      label: 'Trilhas',      icon: 'bi-signpost-split', color: 'var(--primary)' },
  { to: '/cursos',       label: 'Cursos',       icon: 'bi-mortarboard',    color: 'var(--info)' },
  { to: '/modulos',      label: 'Módulos',      icon: 'bi-collection',     color: 'var(--success)' },
  { to: '/aulas',        label: 'Aulas',        icon: 'bi-play-circle',    color: 'var(--warning)' },
  { to: '/usuarios',     label: 'Usuários',     icon: 'bi-people',         color: 'var(--primary)' },
  { to: '/assinaturas',  label: 'Assinaturas',  icon: 'bi-credit-card',    color: 'var(--danger)' },
  { to: '/certificados', label: 'Certificados', icon: 'bi-patch-check',    color: 'var(--success)' },
];

export function Home() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bem-vindo 👋</h1>
          <p className="page-subtitle">Visão geral da plataforma SG Cursos</p>
        </div>
      </div>

      <div className="stat-grid">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
              <i className={`bi ${s.icon}`}></i>
            </div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Acesso rápido</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Navegue para qualquer módulo</div>
        </div>
        <div className="quick-grid">
          {shortcuts.map(s => (
            <NavLink to={s.to} className="quick-card" key={s.to}>
              <i className={`bi ${s.icon}`} style={{ color: s.color }}></i>
              <span>{s.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
