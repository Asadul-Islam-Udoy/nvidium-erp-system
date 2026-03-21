import { Module } from '@nestjs/common';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
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
    SeedModule,
  ],
})
export class AppModule {}
