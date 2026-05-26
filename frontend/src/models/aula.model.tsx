
export interface IAula{
    id?: string;
    titulo: string;
    tipoConteudo: "video" | "texto" | "quiz";
    urlConteudo: string;
    duracao: number;
    ordem: number;
}