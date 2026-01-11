import { PERMISSIONS } from './permission.seed';
export interface RoleDefinition {
  name: string;
  permissions: string[];
}
export const ROLE_DEFINITION: Record<string, RoleDefinition> = {
  SUPER_ADMIN: {
    name: 'super_admin',
    permissions: Object.values(PERMISSIONS),
  },
  ADMIN: {
    name: 'admin',
    permissions: [
      PERMISSIONS.USER_CREATE,
      PERMISSIONS.USER_VIEW,
      PERMISSIONS.USER_UPDATE,
      PERMISSIONS.ROLE_VIEW,
    ],
  },
  USER: {
    name: 'user',
    permissions: [PERMISSIONS.USER_VIEW],
  },
};
