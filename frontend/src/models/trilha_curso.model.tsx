import type { Curso } from "./curso.model";
import type { Trilha } from "./trilha.model";

export interface TrilhaCurso {
  id?: number;
  trilhaId: number;
  cursoId: number;
  ordem: number;
  trilha?: Trilha;
  curso?: Curso;
}
