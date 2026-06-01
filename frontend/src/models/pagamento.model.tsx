export interface Pagamento {
  id?: number;
  usuarioId: number;
  assinaturaId: number;
  valor: number;
  metodo: string;
  status: string;
  dataPagamento: string;
}
