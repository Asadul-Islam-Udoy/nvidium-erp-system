import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('employees')
export class HrController {
  constructor(@Inject('HR_SERVICE') private hrClient: ClientProxy) {}

  @Post()
  createEmployee(@Body() data: any) {
    return this.hrClient.send('create_employee', data);
  }

  @Get()
  getEmployees() {
    return this.hrClient.send('get_employees', {});
  }
}
