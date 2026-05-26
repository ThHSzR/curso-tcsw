import { NavLink } from 'react-router-dom';

export const Header = () => {
    const abas = [
        { label: 'Trilhas',      to: '/trilhas' },
        { label: 'Cursos',       to: '/cursos' },
        { label: 'Módulos',      to: '/modulos' },
        { label: 'Aulas',        to: '/aulas' },
        { label: 'Usuários',     to: '/usuarios' },
        { label: 'Assinaturas',  to: '/assinaturas' },
        { label: 'Certificados', to: '/certificados' },
    ];

    return (
        <>
            {/* Offcanvas (menu lateral) */}
            <div
                className="offcanvas offcanvas-start"
                tabIndex={-1}
                id="offcanvasMenu"
                aria-labelledby="offcanvasMenuLabel"
            >
                <div className="offcanvas-header bg-dark text-white">
                    <h5 className="offcanvas-title" id="offcanvasMenuLabel">
                        <i className="bi bi-mortarboard-fill me-2"></i>SG Cursos
                    </h5>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        data-bs-dismiss="offcanvas"
                        aria-label="Fechar"
                    ></button>
                </div>
                <div className="offcanvas-body p-0">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    'd-flex align-items-center gap-2 text-decoration-none py-1' +
                                    (isActive ? ' fw-semibold text-primary' : ' text-dark')
                                }
                                data-bs-dismiss="offcanvas"
                            >
                                <i className="bi bi-house-fill"></i> Home
                            </NavLink>
                        </li>
                        <li className="list-group-item">
                            <NavLink
                                to="/sgcursos"
                                className={({ isActive }) =>
                                    'd-flex align-items-center gap-2 text-decoration-none py-1' +
                                    (isActive ? ' fw-semibold text-primary' : ' text-dark')
                                }
                                data-bs-dismiss="offcanvas"
                            >
                                <i className="bi bi-grid-fill"></i> SGCursos
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Navbar principal */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
                <button
                    className="btn btn-dark me-2"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasMenu"
                    aria-controls="offcanvasMenu"
                >
                    <i className="bi bi-list fs-5"></i>
                </button>

                <NavLink className="navbar-brand fw-bold" to="/">
                    <i className="bi bi-mortarboard-fill me-2"></i>SG Cursos
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarAbas"
                    aria-controls="navbarAbas"
                    aria-expanded="false"
                    aria-label="Expandir navega\u00e7\u00e3o"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarAbas">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        {abas.map((aba) => (
                            <li className="nav-item" key={aba.to}>
                                <NavLink
                                    to={aba.to}
                                    className={({ isActive }) =>
                                        'nav-link' + (isActive ? ' active fw-semibold' : '')
                                    }
                                >
                                    {aba.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </>
    );
};
