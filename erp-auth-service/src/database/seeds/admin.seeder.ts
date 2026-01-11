import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/user.entity';
import { ROLE_DEFINITION } from './role.seed';
import { Role } from '../../role/role.entity';

@Injectable()
export class SuperAdminSeeder {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async seed() {
    // 3️⃣ Seed super_admin user
    const superAdminEmail = 'superadmin@yohoo.com';
    const superAdminPassword = '12345';

    const existingUser = await this.userRepo.findOne({
      where: { email: superAdminEmail },
    });
    if (!existingUser) {
      const superAdminRole = await this.roleRepo.findOne({
        where: { name: ROLE_DEFINITION.SUPER_ADMIN.name },
      });
      if (!superAdminRole) throw new Error('Super admin role must exist!');

      const user = this.userRepo.create({
        name: 'Super Admin',
        email: superAdminEmail,
        password: superAdminPassword,
        roles: [superAdminRole],
      });

      await this.userRepo.save(user);
      console.log('✅ Super admin user created');
    } else {
      console.log('✅ Super admin user already exists');
    }

    console.log('✅ Seeding finished!');
  }
}
