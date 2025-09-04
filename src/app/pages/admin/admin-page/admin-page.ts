import {Component, OnInit} from '@angular/core';
import {VideoApi} from '../../../services/api/video-api';
import {FormsModule} from '@angular/forms';
import {ShowApiService} from '../../../services/api/show-api-service';
import {ShowModel} from '../../../models/show/show-model';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {NgSelectComponent} from '@ng-select/ng-select';
import {ToastrService} from 'ngx-toastr';
import {GenreApiService} from '../../../services/api/genre-api-service';
import {CustomModalComponent} from '../../../components/custom-modal-component/custom-modal-component';
import {GenreModel} from '../../../models/show/genre-model';

@Component({
  selector: 'app-admin-page',
  imports: [
    FormsModule,
    MatTabGroup,
    MatTab,
    NgSelectComponent,
    CustomModalComponent
  ],
  templateUrl: './admin-page.html',
  standalone: true,
  styleUrl: './admin-page.scss'
})
export class AdminPage implements OnInit {

 showList: ShowModel[] = [];
 selectedShow: ShowModel | undefined;

 genreList: GenreModel[] = [];

 isModalVisible: boolean = false;
 modalContent: string = '';

  confirmAction: () => void = () => {};

  constructor(private videoApiService: VideoApi,
              private showApiService: ShowApiService,
              private toastService: ToastrService,
              private genreApiService: GenreApiService,) {}

  ngOnInit(): void {
    this.testFindAllShows()
    this.findAllGenres();

  }

  scanAllMovies() {
    console.log('scan all movies');
    this.videoApiService.scanAllVideos().subscribe({
      next: (result) => {

      },
      error: (err) => {
        console.log(err);
        this.toastService.error(err.message);
      },
      complete: () => {
        console.log('ScanAllMovies complete');
        this.toastService.success("Successfully scan All Movies");
      }
    })
  }

  updateGenres() {
    console.log('update genres');

    this.genreApiService.updateGenresFromTmdb().subscribe({
      next: () => {},
      error: (err) => {
        console.log("Error while updating genres: ", err)
      },
      complete: () => {
        console.log('ScanAllMovies complete');
        this.toastService.success("Successfully udpate genres");
      }
    })

  }


  testFindAllShows() {
    this.showApiService.findAllShows().subscribe({
      next: (result) => {
        this.showList = result
        this.showList.sort((a, b) => a.id! - b.id!)
        console.log("SHOWS: ", result);
      },
      error: (err) => {
        console.log("Error while loading shows: ", err);
      },
      complete: () => {}
    })
  }

  findAllGenres() {
    this.genreApiService.findAll().subscribe({
      next: value => {
        this.genreList = value
        console.log("genres: ", this.genreList)
      },
      error: (err) => {
        console.log("err while loading genres: ", err)
      },
      complete: () => {}
    })
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
    this.modalContent = "Czy na pewno chcesz przeprowadzić skanowanie plików video?"

    this.confirmAction = () => this.scanAllMovies();

    this.isModalVisible = true;
  }

  setUpGenreModalValues() {
    this.modalContent = "Czy na pewno chcesz przeprowadzić aktualizacje genre? spowoduje to usuniecie oraz ponowne pobranie genre z tmdb api"

    this.confirmAction = () => this.updateGenres();

    this.isModalVisible = true;
  }
}
