import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/createEmployeeDto';
import { EmployeeService } from './employee.service';
import { UpdateEmployeeDto } from './dto/updateEmployeeDto';
import { JwtAuthGuard } from 'src/token/jwt-auth.guard';
import { RolesGuard } from 'src/role/roles.gurd';
import { PermissionsGuard } from 'src/permission/permissions.guard';
import { Permissions } from 'src/permission/permission.decorator';
import { Roles } from 'src/role/roles.decorator';
import { PERMISSIONS } from 'src/database/seeds/permission.seed';
import { ROLE_DEFINITION } from 'src/database/seeds/role.seed';
import { PaginationDto } from 'src/user/dto/paginationDto';
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.employeeService.findAll(pagination);
  }

  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(dto);
  }

  @Permissions(PERMISSIONS.EMPLOYEE_UPDATE)
  @Roles(ROLE_DEFINITION.USER.name)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, dto);
  }
}
