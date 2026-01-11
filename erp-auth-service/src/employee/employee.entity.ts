import { User } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  RESIGNED = 'resigned',
}

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERN = 'intern',
}

@Entity('employees')
@Index('IDX_EMPLOYEE_CODE', ['employeeCode'], { unique: true })
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /* ================= IDENTIFICATION ================= */
  @Column()
  name: string;

  @Column({ unique: true })
  employeeCode: string;

  @Column()
  designation: string;

  @Column({ nullable: true })
  department: string;

  /* ================= EMPLOYMENT ================= */

  @Column({
    type: 'enum',
    enum: EmploymentType,
    default: EmploymentType.FULL_TIME,
  })
  employmentType: EmploymentType;

  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE,
  })
  status: EmployeeStatus;

  @Column({ type: 'date' })
  joiningDate: Date;

  /* ================= CONTACT ================= */

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  emergencyContactNumber: string;

  @Column({ nullable: true })
  emergencyContactRelation: string;

  /* ================= IDENTITY (SENSITIVE) ================= */

  @Column({ nullable: true })
  nidNumber: string;

  @Column({ nullable: true })
  picture: string; // image URL or path

  @Column({ nullable: true, type: 'text' })
  presentAddress: string;

  @Column({ nullable: true, type: 'text' })
  permanentAddress: string;

  /* ================= FINANCIAL (REFERENCE ONLY) ================= */

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  basicSalary: number;

  @Column({ nullable: true })
  accountNumber: string; // string is correct for bank accounts

  @Column({ nullable: true })
  bankName: string;

  /* ================= AUDIT ================= */

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
