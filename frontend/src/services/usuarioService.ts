const BASE = 'http://localhost:3001';

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  tipo: 'aluno' | 'instrutor' | 'admin';
}

export const usuarioService = {
  getAll: (): Promise<Usuario[]> =>
    fetch(`${BASE}/usuarios`).then(r => r.json()),

  getById: (id: number): Promise<Usuario> =>
    fetch(`${BASE}/usuarios/${id}`).then(r => r.json()),

  create: (data: Omit<Usuario, 'id'>): Promise<Usuario> =>
    fetch(`${BASE}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  update: (id: number, data: Partial<Usuario>): Promise<Usuario> =>
    fetch(`${BASE}/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/usuarios/${id}`, { method: 'DELETE' }).then(() => undefined),
};
