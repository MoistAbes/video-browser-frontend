import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { UserInfoModel } from '../../../../../models/user/user-info-model';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms'; // <- importujemy FormsModule
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { AuthRequest } from '../../../../../models/security/auth-request';
import { AuthApiService } from '../../../../../services/api/auth-api-service';
import { EditUserModalComponent } from '../edit-user-modal-component/edit-user-modal-component';
import { CustomModalComponent } from '../../../../../components/custom-modal-component/custom-modal-component';

@Component({
  selector: 'app-users-page-component',
  imports: [
    FormsModule,
    MatExpansionModule,
    MatButtonModule,
    EditUserModalComponent,
    CustomModalComponent,
  ],
  templateUrl: './users-page-component.html',
  styleUrl: './users-page-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPageComponent implements OnChanges {
  @Input() users: UserInfoModel[] = [];

  @Output() userDeleted = new EventEmitter<number>();
  @Output() userUpdated = new EventEmitter<UserInfoModel>();
  @Output() userCreated = new EventEmitter<void>();

  filteredUsers: UserInfoModel[] = []; // lista wyświetlana w tabeli

  selectedUser: UserInfoModel | undefined;
  editingUser: UserInfoModel | undefined;

  newUserUsername: string = '';
  newUserPassword: string = '';
  newUserRepeatPassword: string = '';

  usernameError: boolean = false;
  passwordError: boolean = false;
  repeatPasswordError: boolean = false;

  filterId: number | null = null;
  filterUsername: string = '';
  filterRole: string = '';

  isEditUserOpen: boolean = false;

  modalContent: string = '';
  isModalVisible: boolean = false;

  confirmAction: () => void = () => {};

  constructor(private toastService: ToastrService, private authApiService: AuthApiService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['users'] && this.users) {
      // Gdy przyjdą dane z rodzica, inicjalizujemy filteredUsers
      this.applyFilter();
    }
  }

  onUserEditClick(user: UserInfoModel) {
    this.editingUser = user;
    this.isEditUserOpen = true;
  }

  updateUser(user: UserInfoModel) {
    console.log('edited user to update: ', user);
    this.userUpdated.emit(user);

    this.isEditUserOpen = false;
  }

  deleteUser(userId: number) {
    this.userDeleted.emit(userId);
  }

  setUpUserDeleteModal(userId: number, username: string) {
    this.modalContent = 'Do you want to delete user: ' + username + ' id: ' + userId;

    this.confirmAction = () => this.deleteUser(userId);

    this.isModalVisible = true;
  }

  showMoreUserInfo(user: any) {
    //metoda do pobrania dodatkowych danych o uzytkowniku
    if (this.selectedUser === user) {
      this.selectedUser = undefined; // zamyka panel jeśli kliknięto ponownie
    } else {
      this.selectedUser = user;
    }
  }

  createUser() {
    if (this.validateRegisterValues()) {
      const authRequest: AuthRequest = new AuthRequest(
        this.newUserUsername.trim(),
        this.newUserPassword.trim()
      );
      this.register(authRequest);
    }
  }

  validateRegisterValues(): boolean {
    const formattedUsername: string = this.newUserUsername.trim();
    const formattedPassword: string = this.newUserPassword.trim();
    const formattedRepeatPassword: string = this.newUserRepeatPassword.trim();

    if (formattedUsername.length < 3) {
      this.toastService.warning('Username must be at least 3 characters');
      return false;
    }

    if (formattedPassword.length < 6) {
      this.toastService.warning('Password must be at least 6 characters');
      return false;
    }

    if (formattedPassword !== formattedRepeatPassword) {
      this.toastService.warning('Passwords do not match');
      return false;
    }

    return true;
  }

  register(authRequest: AuthRequest) {
    this.authApiService.register(authRequest).subscribe({
      next: () => {},
      error: (err) => {
        this.toastService.warning(err.error.message);
      },
      complete: () => {
        this.toastService.success('Successfully registered account');
        this.clearForm();
        this.userCreated.emit();
      },
    });
  }

  clearForm() {
    this.newUserUsername = '';
    this.newUserPassword = '';
    this.newUserRepeatPassword = '';
  }

  areRegisterValuesFilled(): boolean {
    const formattedUsername: string = this.newUserUsername.trim();
    const formattedPassword: string = this.newUserPassword.trim();
    const formattedRepeatPassword: string = this.newUserRepeatPassword.trim();

    this.usernameError = formattedUsername.length === 0;
    this.passwordError = formattedPassword.length === 0;
    this.repeatPasswordError = formattedRepeatPassword.length === 0;

    return !(this.usernameError || this.passwordError || this.repeatPasswordError);
  }

  onConfirmed() {
    this.isModalVisible = false;
  }

  onCancelled() {
    this.isModalVisible = false;
  }

  applyFilter() {
    if (!this.users) return;

    this.filteredUsers = this.users.filter((u) => {
      const matchesId = this.filterId ? u.id === this.filterId : true;
      const matchesUsername = this.filterUsername
        ? u.username.toLowerCase().includes(this.filterUsername.toLowerCase())
        : true;
      const matchesRole = this.filterRole
        ? u.roles.some((r: string) => r.toLowerCase().includes(this.filterRole.toLowerCase()))
        : true;

      return matchesId && matchesUsername && matchesRole;
    });
  }
}
