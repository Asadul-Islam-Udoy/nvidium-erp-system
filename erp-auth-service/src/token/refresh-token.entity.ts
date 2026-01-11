import { User } from '../user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('refresh_token')
export class RefreshToken {
  @PrimaryGeneratedColumn() id: number;
  @ManyToOne(() => User) @JoinColumn({ name: 'user_id' }) user: User;
  @Column() tokenHash: string;
  @Column({ default: false }) revoked: boolean;
  @CreateDateColumn() createAt: Date;
  @Column({ type: 'timestamp', nullable: true }) expiresAt: Date;
}
