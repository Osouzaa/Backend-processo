import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  matricula: string;

  @Column()
  password: string

}
