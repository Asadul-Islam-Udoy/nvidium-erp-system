import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Permission } from '../permission/permission.entity';

@Entity({ name: 'roles' })
@Index(['name'], { unique: true })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => User, (user) => user.roles, {
    eager: false,
  })
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: false,
    eager: false,
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
