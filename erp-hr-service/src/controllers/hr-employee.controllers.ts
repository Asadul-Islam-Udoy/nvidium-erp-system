import { Controller } from '@nestjs/common';

@Controller()
export class HrEmployeeController {
  constructor(private readonly hrEmployeeService: any) {}
}
