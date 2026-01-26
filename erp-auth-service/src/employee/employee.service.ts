import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/user/dto/paginationDto';
import { paginationToDataFetch } from 'src/utils/paginationToDataFetch';
import { CreateEmployeeDto } from './dto/createEmployeeDto';
import { User } from 'src/user/user.entity';
import { UpdateEmployeeDto } from './dto/updateEmployeeDto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee) private repo: Repository<Employee>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(pagination: PaginationDto) {
    const qd = this.repo.createQueryBuilder('employee');
    return paginationToDataFetch(
      qd,
      pagination.cursor,
      pagination.limit,
      'id',
      pagination.order,
    );
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateEmployeeDto) {
    const { userId, employeeCode, ...employeeData } = dto;
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    /* ===== Check Employee Code ===== */
    const existingEmployee = await this.repo.findOne({
      where: { employeeCode },
    });

    if (existingEmployee) {
      throw new ConflictException('Employee code already exists');
    }

    const employee = this.repo.create({
      ...employeeData,
      employeeCode,
      user,
    });
    return this.repo.save(employee);
  }

  async update(id: number, dto: UpdateEmployeeDto) {
    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id }, relations: ['user'] });
  }
}
