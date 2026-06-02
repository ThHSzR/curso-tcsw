const BASE = 'http://localhost:3001';

export interface Pagamento {
  id: number;
  assinaturaId: number;
  valorPago: number;
  dataPagamento: string;
  metodoPagamento: string;
  idTransacaoGateway: string;
}

export const pagamentoService = {
  getAll: (): Promise<Pagamento[]> =>
    fetch(`${BASE}/pagamentos`).then(r => r.json()),
  getById: (id: number): Promise<Pagamento> =>
    fetch(`${BASE}/pagamentos/${id}`).then(r => r.json()),
  getByAssinatura: (assinaturaId: number): Promise<Pagamento[]> =>
    fetch(`${BASE}/pagamentos?assinaturaId=${assinaturaId}`).then(r => r.json()),
  create: (data: Omit<Pagamento, 'id'>): Promise<Pagamento> =>
    fetch(`${BASE}/pagamentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  update: (id: number, data: Partial<Omit<Pagamento, 'id'>>): Promise<Pagamento> =>
    fetch(`${BASE}/pagamentos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/pagamentos/${id}`, { method: 'DELETE' }).then(() => undefined),
};
