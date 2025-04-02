import { PartialType } from '@nestjs/swagger';
import { CreateInscricaoEducacaoDto } from './create-inscricao-educacao.dto';

export class UpdateInscricaoEducacaoDto extends PartialType(CreateInscricaoEducacaoDto) {}
