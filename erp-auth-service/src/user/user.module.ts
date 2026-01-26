import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmployeeModule } from '../employee/employee.modul';
// import { PermissionService } from './permissions/permissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EmployeeModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
