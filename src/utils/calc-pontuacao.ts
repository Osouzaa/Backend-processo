import type { CreateInscricaoEducacaoDto } from "src/inscricao-educacao/dto/create-inscricao-educacao.dto";

export function calcularPontuacao(dto: CreateInscricaoEducacaoDto): number {
  let pontuacao = 0;

  if (dto.escolaridade === "Fundamental") {
    if (dto.possuiEnsinoMedio) pontuacao += 10;
    if (dto.possuiEnsinoSuperior) pontuacao += 10;

    pontuacao += Number(dto.tempoExperiencia) * 10;
  }

  if (dto.escolaridade === "Médio") {
    if (dto.possuiEnsinoSuperior) pontuacao += 10;
    if (dto.possuiCursoAreaEducacao) pontuacao += 10;

    pontuacao += Number(dto.tempoExperiencia) * 10;
  }

  if (dto.escolaridade === "Superior") {
    if (dto.possuiDoutorado) pontuacao += 20;
    if (dto.possuiMestrado) pontuacao += 10;

    const qtdEspecializacoes = Number(dto.quantidadeEspecilizacao);
    if (dto.possuiEspecializacao) {
      if (qtdEspecializacoes === 1) pontuacao += 5;
      if (qtdEspecializacoes === 2) pontuacao += 10;
      if (qtdEspecializacoes === 3) pontuacao += 15;
    }

    switch (Number(dto.tempoExperiencia)) {
      case 1: pontuacao += 5; break;
      case 2: pontuacao += 10; break;
      case 3: pontuacao += 15; break;
      case 4: pontuacao += 20; break;
      case 5: pontuacao += 25; break;
    }
  }

  return pontuacao;
}
