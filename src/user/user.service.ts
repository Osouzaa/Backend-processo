import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  // Criação de um usuário com verificação de e-mail existente
  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: {
          email: createUserDto.email
        }
      });
      if (existingUser) {
        throw new ConflictException('E-mail já está em uso');
      }

      const newUser = this.userRepository.create(createUserDto);
      await this.userRepository.save(newUser);
      return newUser; // Retorna o usuário criado
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao criar o usuário');
    }
  }

  // Busca todos os usuários
  async findAll() {
    try {
      const users = await this.userRepository.find();
      return { users };
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar usuários');
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      throw new Error('Erro ao buscar o usuário');
    }
  }

  // Busca um usuário por ID
  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
      }
      return user; // Retorna o usuário encontrado
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar o usuário');
    }
  }

  // Atualiza um usuário por ID
  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      await this.userRepository.update(id, updateUserDto);
      return { ...user, ...updateUserDto }; // Retorna os dados atualizados
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao atualizar o usuário');
    }
  }

  // Remove um usuário por ID
  async remove(id: number) {
    try {
      const user = await this.findOne(id);
      await this.userRepository.remove(user);
      return { message: `Usuário com ID ${id} removido com sucesso` };
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao remover o usuário');
    }
  }
}
