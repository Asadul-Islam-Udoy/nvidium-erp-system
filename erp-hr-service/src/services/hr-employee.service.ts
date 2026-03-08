import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { Prisma, EmployeeStatus } from '@prisma/client';
@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async createEmployee(data: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: {
        userId: data.userId,
        employeeCode: data.employeeCode,
        departmentId: data.departmentId,
        positionId: data.positionId,
        companyId: data.companyId,
        address: data.address,
        joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
        status: data.status,
        salary: data.salary,
      } as Prisma.EmployeeUncheckedCreateInput,
    });
  }

  async getEmployees(page = 1, limit = 10, status?: EmployeeStatus) {
    const skip = (page - 1) * limit;
    const where: Prisma.EmployeeWhereInput = {};
    if (status) {
      where.status = status;
    }

    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { joinDate: 'desc' },
      }),
      this.prisma.employee.count({ where }),
    ]);
    return this.prisma.employee.findMany({
      select: {
        id: true,
        userId: true,
        address: true,
        joinDate: true,
        status: true,
        employeeCode: true,
        departmentId: true, // scalar → select
        positionId: true, // scalar → select
        companyId: true, // scalar → select
        salaries: true, // relation → include/select works
        leaves: true, // relation → include/select works
        performances: true, // relation → include/select works
      },
    });
  }
}
