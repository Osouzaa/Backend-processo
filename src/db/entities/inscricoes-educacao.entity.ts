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
  cpfLink: string;

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

  // Endereço

  @Column({ nullable: true })
  telefone: string;

  @Column()
  cep: string;

  @Column()
  logradouro: string;

  @Column({ nullable: true })
  complemento: string;

  @Column()
  numero: string;

  @Column()
  bairro: string;

  @Column()
  cidade: string;

  @Column()
  estado: string;

  @Column()
  comprovanteEnderecoLink: string;

  ////

  @Column({ nullable: true })
  possuiEnsinoFundamental: string;

  @Column({ nullable: true })
  possuiEnsinoMedio: string;

  @Column({ nullable: true })
  possuiEnsinoSuperior: string;

  @Column({ nullable: true })
  possuiCursoAreaEducacao: string;

  @Column({ nullable: true })
  possuiDoutorado: string;

  @Column({ nullable: true })
  tempoExperiencia: number;

  @OneToMany(() => File, (file) => file.inscricao, { cascade: true })
  files: File[];
}
