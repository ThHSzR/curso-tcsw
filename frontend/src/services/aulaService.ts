const BASE = 'http://localhost:3001';

export interface Aula {
  id?: number;
  titulo: string;
  tipo: 'video' | 'texto' | 'quiz';
  duracao: number;
  url: string;
  moduloId: number;
}

export const aulaService = {
  getAll: (): Promise<Aula[]> =>
    fetch(`${BASE}/aulas`).then(r => r.json()),

  getById: (id: number): Promise<Aula> =>
    fetch(`${BASE}/aulas/${id}`).then(r => r.json()),

  create: (data: Omit<Aula, 'id'>): Promise<Aula> =>
    fetch(`${BASE}/aulas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  update: (id: number, data: Partial<Aula>): Promise<Aula> =>
    fetch(`${BASE}/aulas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/aulas/${id}`, { method: 'DELETE' }).then(() => undefined),
};
