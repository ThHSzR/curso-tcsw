const BASE = 'http://localhost:3001';

export interface Curso {
  id: number;
  titulo: string;
  descricao: string;
  instrutorId: number;
  categoriaId: number;
  nivel: string;
  dataPublicacao: string;
  totalAulas: number;
  totalHoras: number;
}

export const cursoService = {
  getAll: (): Promise<Curso[]> =>
    fetch(`${BASE}/cursos`).then(r => r.json()),
  getById: (id: number): Promise<Curso> =>
    fetch(`${BASE}/cursos/${id}`).then(r => r.json()),
  getByCategoria: (categoriaId: number): Promise<Curso[]> =>
    fetch(`${BASE}/cursos?categoriaId=${categoriaId}`).then(r => r.json()),
  create: (data: Omit<Curso, 'id'>): Promise<Curso> =>
    fetch(`${BASE}/cursos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  update: (id: number, data: Partial<Omit<Curso, 'id'>>): Promise<Curso> =>
    fetch(`${BASE}/cursos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/cursos/${id}`, { method: 'DELETE' }).then(() => undefined),
};
