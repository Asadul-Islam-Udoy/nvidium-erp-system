import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
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
import { Public } from 'src/common/decorators/public.decorator';
import { MessagePattern } from '@nestjs/microservices';

@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @MessagePattern('get_users')
  @Permissions(PERMISSIONS.USER_VIEW_ALL)
  @Roles(ROLE_DEFINITION.ADMIN.name)
  findAll(@Query() pagination: PaginationDto) {
    return this.userService.findAll(pagination);
  }

  @MessagePattern('find_one_user')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @MessagePattern('create_user')
  @Public()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @MessagePattern('update_user')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @MessagePattern('delete_user')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
