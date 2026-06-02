const BASE = 'http://localhost:3001';

export interface Aula {
  id: number;
  titulo: string;
  moduloId: number;
  tipoConteudo: 'Video' | 'Texto' | 'Quiz';
  urlConteudo: string;
  duracaoMinutos: number;
  ordem: number;
}

export const aulaService = {
  getAll: (): Promise<Aula[]> =>
    fetch(`${BASE}/aulas`).then(r => r.json()),
  getByModulo: (moduloId: number): Promise<Aula[]> =>
    fetch(`${BASE}/aulas?moduloId=${moduloId}`).then(r => r.json()),
  getById: (id: number): Promise<Aula> =>
    fetch(`${BASE}/aulas/${id}`).then(r => r.json()),
  create: (data: Omit<Aula, 'id'>): Promise<Aula> =>
    fetch(`${BASE}/aulas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  update: (id: number, data: Partial<Omit<Aula, 'id'>>): Promise<Aula> =>
    fetch(`${BASE}/aulas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/aulas/${id}`, { method: 'DELETE' }).then(() => undefined),
};
