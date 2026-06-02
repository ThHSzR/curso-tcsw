const BASE = 'http://localhost:3001';

export interface ProgressoAula {
  id: number;
  usuarioId: number;
  aulaId: number;
  dataConclusao: string;
  status: 'Concluído' | 'Em Andamento';
}

export const progressoAulaService = {
  getAll: (): Promise<ProgressoAula[]> =>
    fetch(`${BASE}/progresso_aulas`).then(r => r.json()),
  getByUsuario: (usuarioId: number): Promise<ProgressoAula[]> =>
    fetch(`${BASE}/progresso_aulas?usuarioId=${usuarioId}`).then(r => r.json()),
  getByAula: (aulaId: number): Promise<ProgressoAula[]> =>
    fetch(`${BASE}/progresso_aulas?aulaId=${aulaId}`).then(r => r.json()),
  create: (data: Omit<ProgressoAula, 'id'>): Promise<ProgressoAula> =>
    fetch(`${BASE}/progresso_aulas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  update: (id: number, data: Partial<Omit<ProgressoAula, 'id'>>): Promise<ProgressoAula> =>
    fetch(`${BASE}/progresso_aulas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/progresso_aulas/${id}`, { method: 'DELETE' }).then(() => undefined),
};
