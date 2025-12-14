import { UserStatusModel } from './user-status-model';
import { UserIconModel } from './user-icon-model';

export class UserInfoModel {
  id: number | undefined;
  username: string = '';
  iconColor: string = '';
  icon: UserIconModel | null = null;
  roles: string[] = [];
  registrationDate: Date | undefined;
  status: UserStatusModel | null = null;
  active: boolean = false;
}
