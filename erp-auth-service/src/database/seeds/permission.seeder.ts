import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../../permission/permission.entity';
import { Repository } from 'typeorm';
import { PERMISSIONS } from './permission.seed';

@Injectable()
export class PermissionSeeder {
  constructor(
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
  ) {}

  async seed() {
    const existing = await this.permissionRepo.find();
    const exisingNames = existing.map((p) => p.name);

    const newPermissions = Object.values(PERMISSIONS)
      .filter((p) => !exisingNames.includes(p))
      .map((name) => this.permissionRepo.create({ name }));

    await this.permissionRepo.save(newPermissions);
  }
}
