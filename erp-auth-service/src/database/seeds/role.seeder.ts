import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../../permission/permission.entity';
import { Role } from '../../role/role.entity';
import { Repository } from 'typeorm';
import { ROLE_DEFINITION } from './role.seed';

@Injectable()
export class RoleSeeder {
  constructor(
    @InjectRepository(Role) private roleRes: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
  ) {}

  async seed() {
    const permissions = await this.permissionRepo.find();
    for (const role of Object.values(ROLE_DEFINITION)) {
      const exists = await this.roleRes.findOne({ where: { name: role.name } });
      if (exists) continue;

      const rolePermission = permissions.filter((p) =>
        role.permissions.includes(p.name),
      );

      await this.roleRes.save(
        this.roleRes.create({
          name: role.name,
          permissions: rolePermission,
        }),
      );
    }
  }
}
