export interface Pagamento {
  id: number;
  assinaturaId: number;
  valorPago: number;
  dataPagamento: string;
  metodoPagamento: string;
  idTransacaoGateway: string;
}
