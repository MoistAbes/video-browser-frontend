import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UserInfoModel } from '../../../../../models/user/user-info-model';
import { ScreenOverlayComponent } from "../../../../../components/screen-overlay-component/screen-overlay-component";
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-edit-user-modal-component',
  imports: [ScreenOverlayComponent, FormsModule],
  templateUrl: './edit-user-modal-component.html',
  styleUrl: './edit-user-modal-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditUserModalComponent {
  @Input() isVisible = false;
  @Input() user: UserInfoModel | undefined = undefined;

  @Output() save = new EventEmitter<UserInfoModel>();
  @Output() cancel = new EventEmitter<void>();

  tempUser: UserInfoModel = new UserInfoModel();

  ngOnChanges() {
    if (this.user) {
      this.tempUser = structuredClone(this.user);
    }
  }

  toggleRole(role: string) {
  if (this.tempUser.roles.includes(role)) {
    this.tempUser.roles = this.tempUser.roles.filter(r => r !== role);
  } else {
    this.tempUser.roles.push(role);
  }
}

  onSave() {
    this.save.emit(this.tempUser);
  }

  onCancel() {
    this.cancel.emit();
  }
}
