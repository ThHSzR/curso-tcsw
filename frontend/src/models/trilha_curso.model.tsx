import type { ICurso } from "./curso.model";
import type { ITrilha } from "./trilha.model";

export interface ITrilhaCurso{
    trilha: ITrilha;
    curso: ICurso;
    ordem: number;
}