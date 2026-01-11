import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Role } from '../role/role.entity';

@Entity({ name: 'permissions' })
@Index(['name'], { unique: true })
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @ManyToMany(() => Role, (r) => r.permissions, {
    eager: false,
  })
  roles: Role[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
