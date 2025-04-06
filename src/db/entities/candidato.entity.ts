import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { InscricaoEducacao } from './inscricoes-educacao.entity';

@Entity('candidatos')
export class Candidato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senha: string;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  @OneToMany(() => InscricaoEducacao, (inscricao) => inscricao.candidato)
  inscricoesEducacao: InscricaoEducacao[];
}
