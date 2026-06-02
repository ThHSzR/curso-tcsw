export interface Avaliacao {
  id: number;
  usuarioId: number;
  cursoId: number;
  nota: number;
  comentario: string | null;
  dataAvaliacao: string;
}
