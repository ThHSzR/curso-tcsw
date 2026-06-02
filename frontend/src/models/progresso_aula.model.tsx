import type { Aula } from "./aula.model";
import type { Usuario } from "./usuario.model";

export interface ProgressoAula {
  id?: number;
  usuarioId: number;
  aulaId: number;
  dataConclusao: string | null;
  status: 'pendente' | 'concluida';
  usuario?: Usuario;
  aula?: Aula;
}
