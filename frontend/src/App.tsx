import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { SGCursos } from './pages/SGCursos';
import { Trilhas } from './pages/Trilhas';
import { Cursos } from './pages/Cursos';
import { Modulos } from './pages/Modulos';
import { Aulas } from './pages/Aulas';
import { Usuarios } from './pages/Usuarios';
import { Assinaturas } from './pages/Assinaturas';
import { Certificados } from './pages/Certificados';

export function App() {
    return (
        <BrowserRouter>
            <Header />
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
        </BrowserRouter>
    );
}
