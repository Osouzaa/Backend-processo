import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { File } from './file.entity';
import { Candidato } from './candidato.entity';

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

  @Column({ nullable: true })
  escolaridade: string;

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
  email: string;

  @Column({ nullable: true })
  certificadoReservista: string;

  @Column({ nullable: true })
  certificadoReservistaLink: string;

  @Column()
  nacionalidade: string;

  @Column()
  naturalidade: string;

  @Column()
  estadoCivil: string;

  @Column({ nullable: true })
  pcd: string;

  @Column({ nullable: true })
  laudoPcd: string;

  @Column({ nullable: true })
  vagaDestinadaAPCD: string;

  @Column()
  cargoFuncao: string;

  // Endereço

  @Column({ nullable: true })
  contatoTelefoneFixo: string;

  @Column({ nullable: true })
  contatoCelular: string;

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
  quantidadeEnsinoSuperior: string;

  @Column({ nullable: true })
  possuiCursoAreaEducacao: string;

  @Column({ nullable: true })
  quantidadeCursoAreaEducacao: string;

  @Column({ nullable: true })
  possuiDoutorado: string;


  @Column({ nullable: true })
  possuiMestrado: string;


  @Column({ nullable: true })
  possuiEspecializacao: string;

  @Column({ nullable: true })
  quantidadeEspecilizacao: string;

  @Column({ nullable: true })
  tempoExperiencia: number;

  @Column({ nullable: true })
  totalDeDias: number;

  @ManyToOne(() => Candidato, (candidato) => candidato.inscricoesEducacao, { eager: true })
  candidato: Candidato;

  @OneToMany(() => File, (file) => file.inscricao, { cascade: true })
  files: File[];
}
