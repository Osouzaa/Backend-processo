import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('inscricoes_educacao')
export class InscricaoEducacao {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  // 📌 Informações pessoais do candidato
  @Column()
  nomeCompleto: string;

  @Column({ type: 'date' })
  dataNascimento: Date;

  @Column()
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
  laudoPcd: string; // 📂 Link do anexo do laudo PCD

  @Column()
  cargoFuncao: string;

  // 📚 Escolaridade
  @Column({ default: false, nullable: true })
  possuiEnsinoFundamental: boolean; // 📌 Indica se possui ensino fundamental
  @Column({ nullable: true })
  ensinoFundamental: string; // 📂 Link do anexo

  @Column({ default: false, nullable: true })
  possuiEnsinoMedio: boolean; // 📌 Indica se possui ensino médio
  @Column({ nullable: true })
  ensinoMedio: string; // 📂 Link do anexo

  @Column({ default: false, nullable: true })
  possuiEnsinoSuperior: boolean; // 📌 Indica se possui ensino superior
  @Column({ nullable: true })
  ensinoSuperior: string; // 📂 Link do anexo


  @Column({ default: false, nullable: true })
  possuiCursoAreaEducacao: boolean; // 📌 Indica se possui curso na área de educação
  @Column({ nullable: true })
  cursoAreaEducacao: string; // 📂 Link do anexo


  @Column({ default: false, nullable: true })
  possuiDoutorado: boolean; // 📌 Indica se possui doutorado
  @Column({ nullable: true })
  doutorado: string; // 📂 Link do anexo


  // 🏆 Experiência profissional
  @Column({ nullable: true })
  experienciaMunicipalEstadual: string;
}
