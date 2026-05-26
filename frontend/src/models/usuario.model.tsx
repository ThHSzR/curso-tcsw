export interface IUsuario{
    id? : string;
    nome: string;
    email: string;
    perfil: "administrador" | "instrutor" | "aluno";
    senhaHash: string;
    dataCriacao: Date;
    dataAlteracao: Date;
}