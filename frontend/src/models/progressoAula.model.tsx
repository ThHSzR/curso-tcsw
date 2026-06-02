export interface ProgressoAula {
  id: number;
  usuarioId: number;
  aulaId: number;
  dataConclusao: string;
  status: 'Concluído' | 'Em Andamento';
}
