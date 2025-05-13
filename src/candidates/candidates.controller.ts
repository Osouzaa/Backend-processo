import { CurrentUser } from './../decorators/currentUser.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { AuthGuardCandidates } from 'src/candidato-auth/auth.guard';
import type { RecoveryPasswordDto } from './dto/recovery-password.dto';
import type { UpdateScoreDto } from '../inscricao-educacao/dto/update-score.dto';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) { }

  @Post()
  create(@Body() createCandidateDto: CreateCandidateDto) {
    return this.candidatesService.create(createCandidateDto);
  }

  // @UseGuards()
  // @Get()
  // findAll() {
  //   return this.candidatesService.findAll();
  // }

  @Get('verification/:cpf')
  findByCpf(@Param('cpf') cpf: string) {
    return this.candidatesService.findByCpfNivel(cpf);
  }

  @UseGuards(AuthGuardCandidates)
  @Get('me')
  getProfile(@CurrentUser() user: CurrentUser) {
    return this.candidatesService.findByMe(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.candidatesService.findOne(+id);
  }

  @Patch('recoveryPassword/:id')
  recoveryPassword(@Param('id') id: string,
    @Body() newPassword: RecoveryPasswordDto
  ) {
    return this.candidatesService.recoveryPassword(+id, newPassword);
  }



  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCandidateDto: UpdateCandidateDto,
  ) {
    return this.candidatesService.update(+id, updateCandidateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.candidatesService.remove(+id);
  }
}
