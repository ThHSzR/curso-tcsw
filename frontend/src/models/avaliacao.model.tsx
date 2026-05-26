import type { ICurso } from "./curso.model";
import type { IUsuario } from "./usuario.model";

export interface IAvaliacao{
    id?: string;
    usuario: IUsuario;
    curso: ICurso;
    nota: "1" | "2" | "3" | "4" | "5";
    comentario: string;
    dataAvaliacao: Date;
}