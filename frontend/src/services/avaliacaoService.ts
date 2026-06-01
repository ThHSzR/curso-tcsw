const BASE = 'http://localhost:3001';

export interface Avaliacao {
  id?: number;
  usuarioId: number;
  cursoId: number;
  nota: number;
  comentario: string;
  dataAvaliacao: string;
}

export const avaliacaoService = {
  getAll: (): Promise<Avaliacao[]> =>
    fetch(`${BASE}/avaliacoes`).then(r => r.json()),
  create: (data: Omit<Avaliacao, 'id'>): Promise<Avaliacao> =>
    fetch(`${BASE}/avaliacoes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  update: (id: number, data: Partial<Avaliacao>): Promise<Avaliacao> =>
    fetch(`${BASE}/avaliacoes/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/avaliacoes/${id}`, { method: 'DELETE' }).then(() => undefined),
};
