const BASE = 'http://localhost:3001';

export interface Plano {
  id?: number;
  nome: string;
  preco: number;
  descricao: string;
}

export interface Assinatura {
  id?: number;
  usuarioId: number;
  planoId: number;
  dataInicio: string;
  dataFim: string;
  status: 'ativa' | 'cancelada' | 'expirada';
}

export const planoService = {
  getAll: (): Promise<Plano[]> =>
    fetch(`${BASE}/planos`).then(r => r.json()),

  getById: (id: number): Promise<Plano> =>
    fetch(`${BASE}/planos/${id}`).then(r => r.json()),

  create: (data: Omit<Plano, 'id'>): Promise<Plano> =>
    fetch(`${BASE}/planos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  update: (id: number, data: Partial<Plano>): Promise<Plano> =>
    fetch(`${BASE}/planos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/planos/${id}`, { method: 'DELETE' }).then(() => undefined),
};

export const assinaturaService = {
  getAll: (): Promise<Assinatura[]> =>
    fetch(`${BASE}/assinaturas`).then(r => r.json()),

  getByUsuario: (usuarioId: number): Promise<Assinatura[]> =>
    fetch(`${BASE}/assinaturas?usuarioId=${usuarioId}`).then(r => r.json()),

  create: (data: Omit<Assinatura, 'id'>): Promise<Assinatura> =>
    fetch(`${BASE}/assinaturas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  update: (id: number, data: Partial<Assinatura>): Promise<Assinatura> =>
    fetch(`${BASE}/assinaturas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/assinaturas/${id}`, { method: 'DELETE' }).then(() => undefined),
};
