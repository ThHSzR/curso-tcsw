import type { ICategoria } from "./categoria.model";

export interface ITrilha{
    id?: string;
    titulo: string;
    descricao: string;
    categoria: ICategoria;
}