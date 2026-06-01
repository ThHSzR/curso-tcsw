const BASE = 'http://localhost:3001';

export interface Matricula {
  id?: number;
  usuarioId: number;
  cursoId: number;
  dataMatricula: string;
  progresso: number;
}

export const matriculaService = {
  getAll: (): Promise<Matricula[]> =>
    fetch(`${BASE}/matriculas`).then(r => r.json()),
  create: (data: Omit<Matricula, 'id'>): Promise<Matricula> =>
    fetch(`${BASE}/matriculas`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  update: (id: number, data: Partial<Matricula>): Promise<Matricula> =>
    fetch(`${BASE}/matriculas/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/matriculas/${id}`, { method: 'DELETE' }).then(() => undefined),
};
