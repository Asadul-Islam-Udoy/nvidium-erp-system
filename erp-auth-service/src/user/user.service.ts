import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUserDto';
import { UpdateUserDto } from './dto/updateUserDto';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from './dto/paginationDto';
import { paginationToDataFetch } from '../utils/paginationToDataFetch';
import { Role } from '../role/role.entity';
import { ROLE_DEFINITION } from '../database/seeds/role.seed';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findAll(pagination: PaginationDto) {
    const qb = this.repo.createQueryBuilder('user');
    return paginationToDataFetch(
      qb,
      pagination.cursor,
      pagination.limit,
      'id',
      pagination.order,
      ['id', 'name', 'email'],
    );
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.repo.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
  }

  async create(dto: CreateUserDto) {
    try {
      const existing = await this.repo.findOne({ where: { email: dto.email } });
      if (existing) {
        throw new ConflictException('Email already exisits');
      }
      const userRole = await this.repo.manager.findOne(Role, {
        where: { name: ROLE_DEFINITION.USER.name },
      });
      if (!userRole) {
        throw new InternalServerErrorException('Default user role not found');
      }
      const user = this.repo.create({
        ...dto,
        password: dto.password,
        roles: [userRole],
      });
      const saveuser = await this.repo.save(user);
      const { password, ...result } = saveuser;
      return result;
    } catch (error: any) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) return null;
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);
    return this.repo.save(user);
  }

  async delete(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new ConflictException('user is not find');
    await this.repo.delete(id);
    return { deleted: true };
  }

  async findOneWithRolesAndPermissions(userId: number): Promise<User | null> {
    return this.repo.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });
  }
}
