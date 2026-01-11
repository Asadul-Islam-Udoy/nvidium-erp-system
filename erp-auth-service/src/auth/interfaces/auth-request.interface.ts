import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    id: number;
    email: string;
    roles: {
      name: string;
      permissions: { name: string }[];
    }[];
  };
}
