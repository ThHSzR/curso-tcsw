import { Plano } from '../models/plano.model';

const BASE = 'http://localhost:3000/planos';

export const planoService = {
  async getAll(): Promise<Plano[]> {
    const r = await fetch(BASE);
    return r.json();
  },
  async getById(id: number): Promise<Plano> {
    const r = await fetch(`${BASE}/${id}`);
    return r.json();
  },
  async create(data: Plano): Promise<Plano> {
    const r = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return r.json();
  },
  async update(id: number, data: Plano): Promise<Plano> {
    const r = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return r.json();
  },
  async remove(id: number): Promise<void> {
    await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  },
};
