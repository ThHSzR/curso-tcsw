import type { IAula } from "./aula.model";

export interface IModulo{
    id?: string;
    titulo: string;
    ordem: number;
    listaAulas: IAula[];
}