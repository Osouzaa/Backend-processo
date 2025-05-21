import { CreateInscricaoEducacaoDto } from "src/inscricao-educacao/dto/create-inscricao-educacao.dto";

export function calcularPontuacao(dto: Partial<CreateInscricaoEducacaoDto>): number {
  let pontuacao = 0;

  // Função base para calcular pontuação por dias de experiência
  const calcularPontuacaoExperiencia = (dias: number, isSuperior: boolean = false): number => {
    let pontos = 0;

    if (dias === 0) pontos = 0;
    else if (dias <= 365) pontos = 10;
    else if (dias <= 730) pontos = 20;
    else if (dias <= 1095) pontos = 30;
    else if (dias <= 1460) pontos = 40;
    else pontos = 50;

    return isSuperior ? Math.floor(pontos / 2) : pontos;
  };

  const diasExperiencia = Number(dto.tempoExperiencia);

  if (dto.escolaridade === "Fundamental") {
    if (dto.possuiEnsinoMedio === "true") pontuacao += 20;
    if (dto.possuiEnsinoSuperior === "true") pontuacao += 30;

    pontuacao += calcularPontuacaoExperiencia(diasExperiencia);
  }

  if (dto.escolaridade === "Médio") {
    if (dto.possuiEnsinoSuperior === "true") pontuacao += 20;
    if (dto.possuiCursoAreaEducacao === "true") pontuacao += 30;

    pontuacao += calcularPontuacaoExperiencia(diasExperiencia);
  }

  if (dto.escolaridade === "Superior") {
    if (dto.possuiDoutorado === "true") pontuacao += 35;
    if (dto.possuiMestrado === "true") pontuacao += 30;

    const qtdEspecializacoes = Number(dto.quantidadeEspecilizacao);
    if (dto.possuiEspecializacao === 'true') {
      if (qtdEspecializacoes === 1) pontuacao += 5;
      else if (qtdEspecializacoes === 2) pontuacao += 10;
    }

    pontuacao += calcularPontuacaoExperiencia(diasExperiencia, true); // metade da pontuação
  }

  return pontuacao;
}