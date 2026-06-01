const BASE = 'http://localhost:3001';

export interface Trilha {
  id?: number;
  nome: string;
  descricao: string;
  categoriaId: number;
}

export const trilhaService = {
  getAll: (): Promise<Trilha[]> =>
    fetch(`${BASE}/trilhas`).then(r => r.json()),

  getById: (id: number): Promise<Trilha> =>
    fetch(`${BASE}/trilhas/${id}`).then(r => r.json()),

  create: (data: Omit<Trilha, 'id'>): Promise<Trilha> =>
    fetch(`${BASE}/trilhas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  update: (id: number, data: Partial<Trilha>): Promise<Trilha> =>
    fetch(`${BASE}/trilhas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/trilhas/${id}`, { method: 'DELETE' }).then(() => undefined),
};
