// src/database/seeds/seed.service.ts
import { Injectable } from '@nestjs/common';
import { RoleSeeder } from './role.seeder';
import { PermissionSeeder } from './permission.seeder';
import { SuperAdminSeeder } from './admin.seeder';

@Injectable()
export class SeedService {
  constructor(
    private readonly permissionSeeder: PermissionSeeder,
    private readonly roleSeeder: RoleSeeder,
    private readonly adminSeeder: SuperAdminSeeder,
  ) {}

  async seed() {
    console.log('Seeding permissions...');
    await this.permissionSeeder.seed();

    console.log('Seeding roles...');
    await this.roleSeeder.seed();

    console.log('Seeding  admin...');
    await this.adminSeeder.seed();
    console.log('✅ Seeding finished!');
  }
}
