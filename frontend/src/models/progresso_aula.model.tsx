import type { IAula } from "./aula.model";
import type { IUsuario } from "./usuario.model";

export interface IProgressoAula{
    usuario: IUsuario;
    aula: IAula;
    dataConclusao: Date;
    status: "CONCLUIDO" | "EM PROGRESSO" | "NAO INICIADO"
}
