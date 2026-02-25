import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('health')
  async healthCheck() {
    const result = await this.appService.checkDb();
    return { status: 'up', database: result };
  }
}
