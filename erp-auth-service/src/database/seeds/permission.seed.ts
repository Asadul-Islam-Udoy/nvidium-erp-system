export const PERMISSIONS = {
  USER_CREATE: 'user.create',
  USER_VIEW_ALL: 'user.view-all',
  USER_VIEW: 'user.view',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',

  ROLE_CREATE: 'role.create',
  ROLE_VIEW: 'role.view',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',
} as const;

export type PermissionType = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
