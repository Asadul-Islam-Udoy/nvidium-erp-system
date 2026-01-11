import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUserDto';
import { UpdateUserDto } from './dto/updateUserDto';
import { PaginationDto } from './dto/paginationDto';
import { JwtAuthGuard } from '../token/jwt-auth.guard';
import { Permissions } from '../permission/permission.decorator';
import { PERMISSIONS } from '../database/seeds/permission.seed';
import { Roles } from '../role/roles.decorator';
import { ROLE_DEFINITION } from '../database/seeds/role.seed';
import { RolesGuard } from '../role/roles.gurd';
import { PermissionsGuard } from '../permission/permissions.guard';
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Permissions(PERMISSIONS.USER_VIEW_ALL)
  @Roles(ROLE_DEFINITION.ADMIN.name)
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.userService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
