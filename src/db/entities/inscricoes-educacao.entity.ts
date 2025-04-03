import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { File } from './file.entity';

@Entity('inscricoes_educacao')
export class InscricaoEducacao {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  @Column()
  nomeCompleto: string;

  @Column({ nullable: true })
  pontuacao: number;

  @Column()
  dataNascimento: string;

  @Column({ nullable: true })
  rg: string;

  @Column()
  cpf: string;

  @Column()
  genero: string;

  @Column({ nullable: true })
  certificadoReservista: string;

  @Column()
  nacionalidade: string;

  @Column()
  naturalidade: string;

  @Column()
  estadoCivil: string;

  @Column()
  contato: string;

  @Column()
  pcd: string;

  @Column({ nullable: true })
  laudoPcd: string; // Remover depois que a entidade `File` for usada

  @Column()
  cargoFuncao: string;

  @Column({ default: false, nullable: true })
  possuiEnsinoFundamental: boolean;

  @Column({ default: false, nullable: true })
  possuiEnsinoMedio: boolean;

  @Column({ default: false, nullable: true })
  possuiEnsinoSuperior: boolean;

  @Column({ default: false, nullable: true })
  possuiCursoAreaEducacao: boolean;

  @Column({ default: false, nullable: true })
  possuiDoutorado: boolean;

  @Column({ nullable: true })
  tempoExperiencia: number;

  @OneToMany(() => File, (file) => file.inscricao, { cascade: true })
  files: File[];
}
