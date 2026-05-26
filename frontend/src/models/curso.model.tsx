import type { ICategoria } from "./categoria.model";
import type { IModulo } from "./modulo.model";
import type { IUsuario } from "./usuario.model";

export interface ICurso{
    id?: string;
    titulo: string;
    descricao: string;
    nivel: "iniciante" | "intermediario" | "avançado";
    dataPublicacao: Date;
    totalAulas: number;
    totalHoras: number;
    instrutor: IUsuario;
    categoria: ICategoria;
    listaModulos: IModulo[];
}