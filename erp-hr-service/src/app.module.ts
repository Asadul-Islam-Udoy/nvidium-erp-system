import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { EmployeeService } from './services/hr-employee.service';
import { EmployeeController } from './controllers/hr-employee.controllers';

@Module({
  imports: [],
  controllers: [AppController, EmployeeController],
  providers: [AppService, PrismaService, EmployeeService],
})
export class AppModule {}
