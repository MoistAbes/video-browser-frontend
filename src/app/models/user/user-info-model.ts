import {UserStatusModel} from './user-status-model';
import {UserIconModel} from './user-icon-model';

export class UserInfoModel {
  id: number | undefined
  username: string = ''
  iconColor: string = ''
  icon: UserIconModel | null = null
  status: UserStatusModel | null = null
}
