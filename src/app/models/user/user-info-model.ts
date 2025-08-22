import {UserStatusModel} from './user-status-model';

export class UserInfoModel {
  id: number | undefined
  username: string = ''
  iconColor: string = ''
  icon: string = ''
  status: UserStatusModel | null = null
}
