import { Controller } from '@nestjs/common';
import { EmployeeService } from '../services/hr-employee.service';
import { CreateEmployeeDto } from 'src/dto/create-employee.dto';
import { Employee, EmployeeStatus } from '@prisma/client';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @MessagePattern('create_employee')
  async createEmployee(
    @Payload() createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.createEmployee(createEmployeeDto);
  }

  @MessagePattern('get_employees')
  async getEmployees(
    @Payload()
    payload: {
      page?: string;
      limit?: string;
      status?: EmployeeStatus;
    },
  ): Promise<{
    data: Employee[];
    meta: { total: number; page: number; lastPage: number };
  }> {
    const { page, limit, status } = payload;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.employeeService.getEmployees(pageNumber, limitNumber, status);
  }
}
