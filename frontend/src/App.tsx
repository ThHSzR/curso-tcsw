import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Home }         from './pages/Home';
import { SGCursos }     from './pages/SGCursos';
import { Trilhas }      from './pages/Trilhas';
import { Cursos }       from './pages/Cursos';
import { Modulos }      from './pages/Modulos';
import { Aulas }        from './pages/Aulas';
import { Usuarios }     from './pages/Usuarios';
import { Assinaturas }  from './pages/Assinaturas';
import { Certificados } from './pages/Certificados';

const navItems = [
  { section: 'Geral' },
  { to: '/',            label: 'Dashboard', icon: 'bi-grid-1x2' },
  { to: '/sgcursos',    label: 'Visão Geral', icon: 'bi-bar-chart' },
  { section: 'Conteúdo' },
  { to: '/trilhas',     label: 'Trilhas',    icon: 'bi-signpost-split' },
  { to: '/cursos',      label: 'Cursos',     icon: 'bi-mortarboard' },
  { to: '/modulos',     label: 'Módulos',    icon: 'bi-collection' },
  { to: '/aulas',       label: 'Aulas',      icon: 'bi-play-circle' },
  { section: 'Gestão' },
  { to: '/usuarios',    label: 'Usuários',   icon: 'bi-people' },
  { to: '/assinaturas', label: 'Assinaturas',icon: 'bi-credit-card' },
  { to: '/certificados',label: 'Certificados',icon: 'bi-patch-check' },
];

const pageTitles: Record<string, string> = {
  '/':            'Dashboard',
  '/sgcursos':    'Visão Geral',
  '/trilhas':     'Trilhas',
  '/cursos':      'Cursos',
  '/modulos':     'Módulos',
  '/aulas':       'Aulas',
  '/usuarios':    'Usuários',
  '/assinaturas': 'Assinaturas',
  '/certificados':'Certificados',
};

function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? 'SG Cursos';

  return (
    <div className="app-layout">
      {/* Mobile toggle */}
      <button className="sidebar-toggle" onClick={() => setOpen(o => !o)}>
        <i className={`bi ${open ? 'bi-x-lg' : 'bi-list'}`}></i>
      </button>

      {/* Overlay */}
      {open && (
        <div
          style={{ position:'fixed', inset:0, zIndex:99, background:'rgba(0,0,0,0.5)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <NavLink to="/" className="sidebar-logo" onClick={() => setOpen(false)}>
          <div className="sidebar-logo-icon"><i className="bi bi-mortarboard-fill" style={{color:'#fff'}}></i></div>
          <span className="sidebar-logo-text">SG<span>Cursos</span></span>
        </NavLink>

        <nav className="sidebar-nav">
          {navItems.map((item, i) =>
            'section' in item ? (
              <div key={i} className="sidebar-section-label">{item.section}</div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to!}
                end={item.to === '/'}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <i className={`bi ${item.icon}`}></i>
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-version">SG Cursos v1.0 &middot; 2026</div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          <span className="topbar-title">{title}</span>
          <div className="topbar-right">
            <div className="topbar-avatar">TH</div>
          </div>
        </header>

        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/sgcursos"     element={<SGCursos />} />
          <Route path="/trilhas"      element={<Trilhas />} />
          <Route path="/cursos"       element={<Cursos />} />
          <Route path="/modulos"      element={<Modulos />} />
          <Route path="/aulas"        element={<Aulas />} />
          <Route path="/usuarios"     element={<Usuarios />} />
          <Route path="/assinaturas"  element={<Assinaturas />} />
          <Route path="/certificados" element={<Certificados />} />
        </Routes>
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
