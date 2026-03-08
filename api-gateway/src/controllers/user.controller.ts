import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('users')
export class UserController {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}

  @Post()
  create(@Body() data: any) {
    return this.userClient.send('create_user', data);
  }

  @Get()
  getUsers() {
    return this.userClient.send('get_users', {});
  }
}
