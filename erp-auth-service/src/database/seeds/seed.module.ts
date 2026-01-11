import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../role/role.entity';
import { Permission } from '../../permission/permission.entity';
import { RoleSeeder } from './role.seeder';
import { PermissionSeeder } from './permission.seeder';
import { SeedService } from './seed.service';
import { SuperAdminSeeder } from './admin.seeder';
import { User } from '../../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, User])],
  providers: [PermissionSeeder, RoleSeeder, SuperAdminSeeder, SeedService],
  exports: [SeedService],
})
export class SeedModule {}
