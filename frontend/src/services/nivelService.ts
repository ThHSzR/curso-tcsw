const BASE = 'http://localhost:3001';

export interface Nivel {
  id: number;
  nome: string;
}

export const nivelService = {
  getAll: (): Promise<Nivel[]> =>
    fetch(`${BASE}/niveis`).then(r => r.json()),
  create: (data: Omit<Nivel, 'id'>): Promise<Nivel> =>
    fetch(`${BASE}/niveis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  update: (id: number, data: Partial<Omit<Nivel, 'id'>>): Promise<Nivel> =>
    fetch(`${BASE}/niveis/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/niveis/${id}`, { method: 'DELETE' }).then(() => undefined),
};
