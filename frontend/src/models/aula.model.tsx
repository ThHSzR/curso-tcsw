export interface Aula {
  id: number;
  titulo: string;
  moduloId: number;
  tipoConteudo: 'Video' | 'Texto' | 'Quiz';
  urlConteudo: string;
  duracaoMinutos: number;
  ordem: number;
}
