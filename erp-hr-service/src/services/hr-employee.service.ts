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
        userId: data.userId || null,
        employeeCode: data.employeeCode || null,
        departmentId: data.departmentId || null,
        positionId: data.positionId || null,
        companyId: data.companyId || null,
        address: data.address || null,
        joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
        status: data.status,
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
        select: {
          id: true,
          userId: true,
          employeeCode: true,
          address: true,
          joinDate: true,
          status: true,
          departmentId: true,
          positionId: true,
          companyId: true,
          salaries: {
            select: { base: true, bonus: true, effective: true },
          },
          leaves: {
            select: {
              startDate: true,
              endDate: true,
              type: true,
              status: true,
            },
          },
          performances: {
            select: { rating: true, reviewDate: true },
          },
        },
      }),
      this.prisma.employee.count({ where }),
    ]);
    return {
      data: employees,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
}
