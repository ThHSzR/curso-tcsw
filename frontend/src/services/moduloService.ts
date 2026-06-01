const BASE = 'http://localhost:3001';

export interface Modulo {
  id?: number;
  nome: string;
  ordem: number;
  cursoId: number;
}

export const moduloService = {
  getAll: (): Promise<Modulo[]> =>
    fetch(`${BASE}/modulos`).then(r => r.json()),

  getByCurso: (cursoId: number): Promise<Modulo[]> =>
    fetch(`${BASE}/modulos?cursoId=${cursoId}`).then(r => r.json()),

  getById: (id: number): Promise<Modulo> =>
    fetch(`${BASE}/modulos/${id}`).then(r => r.json()),

  create: (data: Omit<Modulo, 'id'>): Promise<Modulo> =>
    fetch(`${BASE}/modulos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  update: (id: number, data: Partial<Modulo>): Promise<Modulo> =>
    fetch(`${BASE}/modulos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/modulos/${id}`, { method: 'DELETE' }).then(() => undefined),
};
