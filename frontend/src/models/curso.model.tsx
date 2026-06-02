export interface Curso {
  id: number;
  titulo: string;
  descricao: string;
  instrutorId: number;
  categoriaId: number;
  nivel: string;
  dataPublicacao: string;
  totalAulas: number;
  totalHoras: number;
}
