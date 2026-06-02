const BASE = 'http://localhost:3001';

export interface TrilhaCurso {
  id: number;
  trilhaId: number;
  cursoId: number;
  ordem: number;
}

export const trilhaCursoService = {
  getAll: (): Promise<TrilhaCurso[]> =>
    fetch(`${BASE}/trilhas_cursos`).then(r => r.json()),
  getByTrilha: (trilhaId: number): Promise<TrilhaCurso[]> =>
    fetch(`${BASE}/trilhas_cursos?trilhaId=${trilhaId}`).then(r => r.json()),
  create: (data: Omit<TrilhaCurso, 'id'>): Promise<TrilhaCurso> =>
    fetch(`${BASE}/trilhas_cursos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  update: (id: number, data: Partial<Omit<TrilhaCurso, 'id'>>): Promise<TrilhaCurso> =>
    fetch(`${BASE}/trilhas_cursos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/trilhas_cursos/${id}`, { method: 'DELETE' }).then(() => undefined),
};
