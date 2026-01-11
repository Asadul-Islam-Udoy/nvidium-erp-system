import bcrypt from 'bcrypt';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
  Index,
} from 'typeorm';
import { Role } from '../role/role.entity';

@Entity({ name: 'users' })
@Index(['email'], { unique: true })
@Index(['createdAt', 'id'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @ManyToMany(() => Role, (role) => role.users, {
    cascade: true,
    eager: false,
  })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @Column({ default: true }) status: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true, select: false })
  emailVerificationToken: string;

  @Column({ nullable: true, type: 'timestamptz', select: false })
  emailVerificationTokenExpries: Date;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (!this.password) return;
    if (this.password.startsWith('$2b$')) return;
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  async comparePassword(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.password);
  }
  @Column({ default: false })
  isBlock: boolean;
}
