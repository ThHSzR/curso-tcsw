const BASE = 'http://localhost:3001';

export interface Curso {
  id: number;
  nome: string;
  descricao: string;
  cargaHoraria: number;
  instrutorId: number;
  categoriaId: number;
  nivelId: number;
  trilhaId: number;
}

export const cursoService = {
  getAll: (): Promise<Curso[]> =>
    fetch(`${BASE}/cursos`).then(r => r.json()),
  getById: (id: number): Promise<Curso> =>
    fetch(`${BASE}/cursos/${id}`).then(r => r.json()),
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
