import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from '../dto/user-dto/createUserDto';
import { UpdateUserDto } from '../dto/user-dto/updateUserDto';
import { lastValueFrom } from 'rxjs';

@Controller('users')
export class UserController {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}

  @Post('/register')
  async create(@Body() dto: CreateUserDto) {
    try {
      const user = await lastValueFrom(
        this.userClient.send('create_user', dto),
      );

      return user;
    } catch (error: any) {
      console.log('MICROSERVICE ERROR:', error);

      if (error?.statusCode === 409) {
        throw new ConflictException(error.message);
      }

      throw new InternalServerErrorException(
        error?.message || 'Something went wrong',
      );
    }
  }

  @Get()
  getUsers() {
    return this.userClient.send('find_all_users', {});
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userClient.send('find_one_user', id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.userClient.send('update_user', { id, dto });
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userClient.send('delete_user', id);
  }
}
