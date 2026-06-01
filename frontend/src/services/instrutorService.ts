const BASE = 'http://localhost:3001';

export interface Instrutor {
  id?: number;
  nome: string;
  email: string;
  bio: string;
}

export const instrutorService = {
  getAll: (): Promise<Instrutor[]> =>
    fetch(`${BASE}/instrutores`).then(r => r.json()),
};
