import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { InscricaoEducacao } from './inscricoes-educacao.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => InscricaoEducacao, (inscricao) => inscricao.files, { onDelete: 'CASCADE' })
  inscricao: InscricaoEducacao;
}
