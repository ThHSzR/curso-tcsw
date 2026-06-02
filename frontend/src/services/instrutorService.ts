const BASE = 'http://localhost:3001';

export interface Instrutor {
  id: number;
  nome: string;
  email: string;
  bio: string;
}

export const instrutorService = {
  getAll: (): Promise<Instrutor[]> =>
    fetch(`${BASE}/instrutores`).then(r => r.json()),
  getById: (id: number): Promise<Instrutor> =>
    fetch(`${BASE}/instrutores/${id}`).then(r => r.json()),
  create: (data: Omit<Instrutor, 'id'>): Promise<Instrutor> =>
    fetch(`${BASE}/instrutores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  update: (id: number, data: Partial<Omit<Instrutor, 'id'>>): Promise<Instrutor> =>
    fetch(`${BASE}/instrutores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/instrutores/${id}`, { method: 'DELETE' }).then(() => undefined),
};
