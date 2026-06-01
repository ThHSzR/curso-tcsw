const BASE = 'http://localhost:3001';

export interface Categoria {
  id?: number;
  nome: string;
  descricao: string;
}

export const categoriaService = {
  getAll: (): Promise<Categoria[]> =>
    fetch(`${BASE}/categorias`).then(r => r.json()),

  getById: (id: number): Promise<Categoria> =>
    fetch(`${BASE}/categorias/${id}`).then(r => r.json()),

  create: (data: Omit<Categoria, 'id'>): Promise<Categoria> =>
    fetch(`${BASE}/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  update: (id: number, data: Partial<Categoria>): Promise<Categoria> =>
    fetch(`${BASE}/categorias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/categorias/${id}`, { method: 'DELETE' }).then(() => undefined),
};
