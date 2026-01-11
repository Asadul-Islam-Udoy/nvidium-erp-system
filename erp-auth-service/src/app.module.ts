import { Module } from '@nestjs/common';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { EmployeeModule } from './employee/employee.modul';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './database/seeds/seed.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    RoleModule,
    PermissionModule,
    EmployeeModule,
    SeedModule,
  ],
})
export class AppModule {}
