import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmployeeService } from '../services/hr-employee.service';
import { CreateEmployeeDto } from 'src/dto/create-employee.dto';
import { Employee } from '@prisma/client';

@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.createEmployee(createEmployeeDto);
  }

  @Get()
  async getEmployees(): Promise<Employee[]> {
    return this.employeeService.getEmployees();
  }
}
