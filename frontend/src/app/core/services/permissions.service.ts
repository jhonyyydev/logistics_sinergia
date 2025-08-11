import { Injectable } from '@angular/core';
import { MENU_CONFIG } from '../config/menu.config';
import { MenuItem } from '../../features/dashboard/domain/entities/menu-item.entity';

type PermissionKey = keyof typeof MENU_CONFIG;

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  getMenuFromPermissions(permissions: string[]): MenuItem[] {
    return permissions
      .filter((p): p is PermissionKey => p in MENU_CONFIG)
      .map(p => MENU_CONFIG[p]);
  }
}
