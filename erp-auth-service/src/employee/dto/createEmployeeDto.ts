import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';
import { EmployeeStatus, EmploymentType } from '../employee.entity';

export class CreateEmployeeDto {
  /* ========== USER ========== */
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  userId: number;

  /* ========== IDENTIFICATION ========== */
  @IsString()
  name: string;

  @IsString()
  employeeCode: string;

  @IsString()
  designation: string;

  @IsOptional()
  @IsString()
  department?: string;

  /* ========== EMPLOYMENT ========== */
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

  @IsDateString()
  joiningDate: Date;

  /* ========== CONTACT ========== */
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  emergencyContactNumber?: string;

  @IsOptional()
  @IsString()
  emergencyContactRelation?: string;

  /* ========== IDENTITY ========== */
  @IsOptional()
  @IsString()
  nidNumber?: string;

  @IsOptional()
  @IsString()
  picture?: string;

  @IsOptional()
  @IsString()
  presentAddress?: string;

  @IsOptional()
  @IsString()
  permanentAddress?: string;

  /* ========== FINANCIAL ========== */
  @IsOptional()
  @IsNumber()
  basicSalary?: number;

  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  bankName?: string;
}
