export interface Matricula {
  id: number;
  usuarioId: number;
  cursoId: number;
  dataMatricula: string;
  dataConclusao: string | null;
}
