const BASE = 'http://localhost:3001';

export interface Nivel {
  id: number;
  nome: string;
}

export const nivelService = {
  getAll: (): Promise<Nivel[]> =>
    fetch(`${BASE}/niveis`).then(r => r.json()),
};
