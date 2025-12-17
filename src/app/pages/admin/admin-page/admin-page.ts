import { Component, OnInit } from '@angular/core';
import { VideoApi } from '../../../services/api/video-api';
import { FormsModule } from '@angular/forms';
import { ShowApiService } from '../../../services/api/show-api-service';
import { ShowModel } from '../../../models/show/show-model';
import { ToastrService } from 'ngx-toastr';
import { GenreApiService } from '../../../services/api/genre-api-service';
import { CustomModalComponent } from '../../../components/custom-modal-component/custom-modal-component';
import { GenreModel } from '../../../models/show/genre-model';
import { SeasonModel } from '../../../models/show/season-model';
import { UserInfoModel } from '../../../models/user/user-info-model';
import { MediaItemApiService } from '../../../services/api/media-item-api-service';
import { UsersPageComponent } from './components/users-page-component/users-page-component';
import { SimpleTabsComponent } from '../../../components/shared/simple-tabs/simple-tabs-component/simple-tabs-component';
import { SimpleTabComponent } from '../../../components/shared/simple-tabs/simple-tab.component/simple-tab.component';
import { UserInfoApiService } from '../../../services/api/user-info-api-service';
import { GenrePageComponent } from './components/genre-page-component/genre-page-component';
import { ShowsPageComponent } from './components/shows-page-component/shows-page-component';
import { SeasonApiService } from '../../../services/api/season-api-service';
import { ScanSessionApiService } from '../../../services/api/scan-session-api-service';
import { ScanSessionModel } from '../../../models/camunda/scan-session-model';
import { ControllPageComponent } from './components/controll-page-component/controll-page-component';

@Component({
  selector: 'app-admin-page',
  imports: [
    FormsModule,
    CustomModalComponent,
    UsersPageComponent,
    SimpleTabsComponent,
    SimpleTabComponent,
    GenrePageComponent,
    ShowsPageComponent,
    ControllPageComponent,
  ],
  templateUrl: './admin-page.html',
  standalone: true,
  styleUrl: './admin-page.scss',
})
export class AdminPage implements OnInit {
  showList: ShowModel[] = [];
  filteredShowList: ShowModel[] = [];
  selectedShow: ShowModel | undefined;
  seletedSeason: SeasonModel | undefined;

  scanSessionList: ScanSessionModel[] = [];

  idShowFilterValue: number | null = null;
  nameShowFilterValue: string = '';

  genreList: GenreModel[] = [];

  isModalVisible: boolean = false;
  modalContent: string = '';

  isShowTableVisible: boolean = false;
  isGenreTableVisible: boolean = true;
  isSeasonsVisible: boolean = true;
  isEpisodeTableVisible: boolean = true;
  isMovieTableVisible: boolean = true;

  users: UserInfoModel[] = [];

  confirmAction: () => void = () => {};

  constructor(
    private videoApiService: VideoApi,
    private showApiService: ShowApiService,
    private toastService: ToastrService,
    private genreApiService: GenreApiService,
    private mediaItemApiService: MediaItemApiService,
    private userInfoApiService: UserInfoApiService,
    private seasonApiService: SeasonApiService,
    private scanSessionApiService: ScanSessionApiService
  ) {}

  ngOnInit(): void {
    this.testFindAllShows();
    this.findAllGenres();
    this.findAllUsers();
    this.findAllSessionScans();
  }

  onShowDeleted(showId: number) {
    this.showApiService.deleteShow(showId).subscribe({
      next: () => {
        this.showList = this.showList.filter((s) => s.id !== showId);
        this.toastService.success('Show deleted');
      },
      error: (err) => {
        this.toastService.warning(err.error.message);
      },
    });
  }

  onSeasonDeleted(event: { seasonId: number; showId: number }) {
    this.seasonApiService.deleteSeason(event.seasonId).subscribe({
      next: () => {
        this.showList = this.showList.map((show) => {
          if (show.id !== event.showId) {
            return show;
          }

          return {
            ...show,
            seasons: show.seasons.filter((season) => season.id !== event.seasonId),
          };
        });

        this.toastService.success('Season deleted');
      },
      error: (err) => {
        this.toastService.warning(err.error.message);
      },
    });
  }

  onEpisodeDeleted(event: { episodeId: number; seasonId: number; showId: number }) {
    this.mediaItemApiService.deleteById(event.episodeId).subscribe({
      next: () => {
        this.showList = this.showList.map((show) => {
          if (show.id !== event.showId) {
            return show;
          }

          return {
            ...show,
            seasons: show.seasons.map((season) => {
              if (season.id !== event.seasonId) {
                return season;
              }

              return {
                ...season,
                episodes: season.episodes.filter((episode) => episode.id !== event.episodeId),
              };
            }),
          };
        });

        this.toastService.success('Episode deleted');
      },
      error: (err) => {
        this.toastService.warning(err.error.message);
      },
    });
  }

  onUserDeleted(userId: number) {
    this.userInfoApiService.deleteUserById(userId).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== userId);
        this.toastService.success('User deleted');
      },
      error: (err) => {
        this.toastService.warning(err.error.message);
      },
    });
  }

  onUserCreated() {
    this.findAllUsers();
  }

  onUserUpdated(updatedUser: UserInfoModel) {
    const payload = {
      id: updatedUser.id,
      active: updatedUser.active,
      admin: updatedUser.roles.includes('ADMIN'),
    };

    this.userInfoApiService.updateUser(payload).subscribe({
      next: (savedUser) => {
        this.users = this.users.map((u) => (u.id === savedUser.id ? savedUser : u));
      },
      error: (err) => {
        this.toastService.warning(err.error.message);
      },
    });
  }

  findAllUsers() {
    this.userInfoApiService.findAll().subscribe({
      next: (result) => {
        this.users = result;
        console.log('users loaded: ', this.users);
      },
      error: (err) => {
        console.log(err);
        this.toastService.error(err.message);
      },
      complete: () => {},
    });
  }

  fullLibraryScan(event: void) {
    this.videoApiService.fullLibraryScan().subscribe({
      next: (apiResponse) => {
        this.toastService.success(apiResponse.message);
      },
      error: (err) => {
        console.log(err);
        this.toastService.error(err.message);
      },
      complete: () => {},
    });
  }

  testFindAllShows() {
    this.showApiService.findAllShows().subscribe({
      next: (result) => {
        this.showList = result;
        this.showList.sort((a, b) => a.id! - b.id!);
        this.filteredShowList = [...this.showList];
      },
      error: (err) => {
        console.log('Error while loading shows: ', err);
      },
      complete: () => {},
    });
  }

  findAllGenres() {
    this.genreApiService.findAll().subscribe({
      next: (value) => {
        this.genreList = value;
      },
      error: (err) => {
        console.log('err while loading genres: ', err);
      },
      complete: () => {},
    });
  }

  onShowRowClick(show: ShowModel) {
    this.selectedShow = show;
  }

  onConfirmed() {
    this.isModalVisible = false;
  }

  onCancelled() {
    this.isModalVisible = false;
  }

  setUpShowDeleteModalValues(selectedShow: ShowModel) {
    this.selectedShow = selectedShow;
    this.modalContent = 'Czy na pewno chcesz usunąć ' + selectedShow?.name + ' show ?';

    this.confirmAction = () => this.deleteShow();

    this.isModalVisible = true;
  }

  deleteShow() {
    this.showApiService.deleteShow(this.selectedShow!.id!).subscribe({
      next: () => {},
      error: (err) => {
        this.toastService.error('Something went wrong: ' + err.error);
      },
      complete: () => {
        this.toastService.success('Succesfully deleted show');
      },
    });
  }

  filterShows() {
    this.filteredShowList = [...this.showList];

    if (this.idShowFilterValue) {
      this.filteredShowList = this.filteredShowList.filter(
        (show) => show.id == this.idShowFilterValue
      );
    }

    this.filteredShowList = this.filteredShowList.filter((show) =>
      show.name.toLowerCase().includes(this.nameShowFilterValue.toLowerCase().trim())
    );
  }

  convertMediaItemsAudioCodec() {
    this.mediaItemApiService.convertAudioCodec().subscribe({
      next: () => {},
      error: (err) => {
        this.toastService.error(
          'Something went wrong while trying to start converting audio codecs: ' + err.error
        );
      },
      complete: () => {
        this.toastService.success('Started converting audio codes');
      },
    });
  }

  setUpDeleteAllShows() {
    this.modalContent = 'Czy na pewno chcesz usunąć wszystkie shows ?';

    this.confirmAction = () => this.deleteAllShows();

    this.isModalVisible = true;
  }

  deleteAllShows() {
    this.showApiService.deleteAllShows().subscribe({
      next: () => {},
      error: (err) => {
        this.toastService.error(
          'Something went wrong while trying to delete all shows: ' + err.error
        );
      },
      complete: () => {
        this.toastService.success('Succesfully deleted all shows');
      },
    });
  }

  findAllSessionScans() {
    this.scanSessionApiService.findAll().subscribe({
      next: (result) => {
        this.scanSessionList = result;
        console.log('scan Session loaded: ', this.scanSessionList);
      },
      error: (err) => {
        console.log(err);
        this.toastService.error(err.message);
      },
      complete: () => {},
    });
  }
}
