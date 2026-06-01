const BASE = 'http://localhost:3001';

export interface Pagamento {
  id?: number;
  usuarioId: number;
  assinaturaId: number;
  valor: number;
  metodo: 'cartao' | 'boleto' | 'pix';
  status: 'pendente' | 'aprovado' | 'recusado';
  dataPagamento: string;
}

export const pagamentoService = {
  getAll: (): Promise<Pagamento[]> =>
    fetch(`${BASE}/pagamentos`).then(r => r.json()),

  getByUsuario: (usuarioId: number): Promise<Pagamento[]> =>
    fetch(`${BASE}/pagamentos?usuarioId=${usuarioId}`).then(r => r.json()),

  create: (data: Omit<Pagamento, 'id'>): Promise<Pagamento> =>
    fetch(`${BASE}/pagamentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  update: (id: number, data: Partial<Pagamento>): Promise<Pagamento> =>
    fetch(`${BASE}/pagamentos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/pagamentos/${id}`, { method: 'DELETE' }).then(() => undefined),
};
