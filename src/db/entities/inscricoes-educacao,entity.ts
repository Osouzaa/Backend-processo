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

  @Column({ default: false })
  pcd: boolean;

  @Column({ nullable: true })
  laudoPcd: string; // 📂 Link do anexo do laudo PCD

  @Column()
  cargoFuncao: string;

  // 📚 Escolaridade
  @Column({ nullable: true })
  ensinoFundamental: string; // 📂 Link do anexo

  @Column({ nullable: true })
  ensinoMedio: string; // 📂 Link do anexo

  @Column({ nullable: true })
  ensinoSuperior: string;

  @Column({ nullable: true })
  cursoAreaEducacao: string;

  @Column({ nullable: true })
  doutorado: string;

  // 🏆 Experiência profissional
  @Column({ nullable: true })
  experienciaMunicipalEstadual: string;
}
