import { Component, OnInit } from '@angular/core';
import { VideoApi } from '../../../services/api/video-api';
import { FormsModule } from '@angular/forms';
import { ShowApiService } from '../../../services/api/show-api-service';
import { ShowModel } from '../../../models/show/show-model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { GenreApiService } from '../../../services/api/genre-api-service';
import { CustomModalComponent } from '../../../components/custom-modal-component/custom-modal-component';
import { GenreModel } from '../../../models/show/genre-model';
import { SeasonModel } from '../../../models/show/season-model';
import { UserInfoApiService } from '../../../services/api/user-info-api-service';
import { UserInfoModel } from '../../../models/user/user-info-model';
import { StreamApiService } from '../../../services/api/stream-api-service';
import { MediaItemApiService } from '../../../services/api/media-item-api-service';

@Component({
  selector: 'app-admin-page',
  imports: [FormsModule, MatTabGroup, MatTab, NgSelectComponent, CustomModalComponent],
  templateUrl: './admin-page.html',
  standalone: true,
  styleUrl: './admin-page.scss',
})
export class AdminPage implements OnInit {
  showList: ShowModel[] = [];
  filteredShowList: ShowModel[] = [];
  selectedShow: ShowModel | undefined;
  seletedSeason: SeasonModel | undefined;

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
    private userInfoApiService: UserInfoApiService,
    private streamApiService: StreamApiService,
    private mediaItemApiService: MediaItemApiService
  ) {}

  ngOnInit(): void {
    this.testFindAllShows();
    this.findAllGenres();
    this.findAllUsers();
  }

  findAllUsers() {
    this.userInfoApiService.findAll().subscribe({
      next: (result) => {
        this.users = result;
        console.log('USERS: ', this.users);
      },
      error: (err) => {
        console.log(err);
        this.toastService.error(err.message);
      },
      complete: () => {},
    });
  }

  scanAllMovies() {
    console.log('scan all movies');
    this.videoApiService.scanAllVideos().subscribe({
      next: (result) => {},
      error: (err) => {
        console.log(err);
        this.toastService.error(err.message);
      },
      complete: () => {
        console.log('ScanAllMovies complete');
        this.toastService.success('Successfully scan All Movies');
      },
    });
  }

  updateGenres() {
    console.log('update genres');

    this.genreApiService.updateGenresFromTmdb().subscribe({
      next: () => {},
      error: (err) => {
        console.log('Error while updating genres: ', err);
      },
      complete: () => {
        console.log('ScanAllMovies complete');
        this.toastService.success('Successfully udpate genres');
      },
    });
  }

  testFindAllShows() {
    this.showApiService.findAllShows().subscribe({
      next: (result) => {
        this.showList = result;
        this.showList.sort((a, b) => a.id! - b.id!);
        this.filteredShowList = [...this.showList];
        console.log('SHOWS: ', result);
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
        console.log('genres: ', this.genreList);
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

  setUpVideoScanModalValues() {
    this.modalContent = 'Czy na pewno chcesz przeprowadzić skanowanie plików video?';

    this.confirmAction = () => this.scanAllMovies();

    this.isModalVisible = true;
  }

  setUpGenreModalValues() {
    this.modalContent =
      'Czy na pewno chcesz przeprowadzić aktualizacje genre? spowoduje to usuniecie oraz ponowne pobranie genre z tmdb api';

    this.confirmAction = () => this.updateGenres();

    this.isModalVisible = true;
  }

  setUpShowDeleteModalValues(selectedShow: ShowModel) {
    this.selectedShow = selectedShow;
    this.modalContent = 'Czy na pewno chcesz usunąć ' + selectedShow?.name + ' show ?';

    this.confirmAction = () => this.deleteShow();

    this.isModalVisible = true;
  }

  deleteShow() {
    console.log('delete show is running');

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

  testStreamAuthorize() {
    this.streamApiService.authorizeStream().subscribe({
      next: (value) => {
        console.log('KEY: ', value);
      },
      error: (err) => {
        console.log('something went wrong while genereating stream key: ', err.error);
      },
      complete: () => {},
    });
  }

  filterShows() {
    this.filteredShowList = [...this.showList];

    console.log('this.idShowFilterValue: ', this.idShowFilterValue);
    console.log('this.nameShowFilterValue: ', this.nameShowFilterValue);

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
}
