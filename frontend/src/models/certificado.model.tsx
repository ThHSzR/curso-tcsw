export interface Certificado {
  id: number;
  usuarioId: number;
  cursoId: number;
  trilhaId: number | null;
  codigoVerificacao: string;
  dataEmissao: string;
}
