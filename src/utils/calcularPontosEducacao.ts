type DadosEducacaoSimplificado = {
  possuiEnsinoMedio: string;
  possuiEnsinoSuperior: string;
  possuiCursoAreaEducacao: string;
  possuiEspecializacao: string;
  possuiMestrado: string;
  possuiDoutorado: string;
  quantidadeEspecilizacao?: string;
};
export function calcularPontosEducacao(item: DadosEducacaoSimplificado, escolaridade: string): number {
  let pontos = 0;

  if (escolaridade === "Fundamental") {
    if (item.possuiEnsinoMedio === 'true') {
      pontos += 10;
    }
    if (item.possuiEnsinoSuperior === 'true') pontos += 10;
  }

  if (escolaridade === "Médio") {
    if (item.possuiEnsinoSuperior === 'true') pontos += 10;
    if (item.possuiCursoAreaEducacao === 'true') pontos += 10;
  }

  if (escolaridade === "Superior") {
    if (item.possuiDoutorado === 'true') pontos += 20;
    if (item.possuiMestrado === 'true') pontos += 10;
    if (Number(item.quantidadeEspecilizacao) === 1) pontos += 5;
    if (Number(item.quantidadeEspecilizacao) === 2) pontos += 10;
    if (Number(item.quantidadeEspecilizacao) === 3) pontos += 15;
  }
  return pontos;
}
