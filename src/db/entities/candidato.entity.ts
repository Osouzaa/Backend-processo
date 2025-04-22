import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
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
  celular: string;

  @Column()
  cpf: string;

  @Column()
  senha_hash: string;

  @Column({ type: 'varchar', nullable: true })
  codigoVerificacao: string | null;

  @Column({ default: false })
  verificado: boolean;

  @OneToMany(() => InscricaoEducacao, (inscricao) => inscricao.candidato)
  inscricoesEducacao: InscricaoEducacao[];
}
