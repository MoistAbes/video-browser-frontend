import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {VideoCardComponent} from '../../components/video-card-component/video-card-component';
import {Router} from '@angular/router';
import {ShowApiService} from '../../services/api/show-api-service';
import {ShowModel} from '../../models/show-model';
import {UtilService} from '../../services/local/util-service';

@Component({
  standalone: true,
  selector: 'app-search-page',
  imports: [
    FormsModule,
    FontAwesomeModule,
    VideoCardComponent,
  ],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss'
})
export class SearchPage implements OnInit  {
  @ViewChild('target', { static: false }) target!: ElementRef;

  filterTitleValue: string = '';

  hoverTimer: number | null = null;

  showList: ShowModel[] = []
  showListFiltered: ShowModel[] = []

  constructor(private router: Router,
              private showApiService: ShowApiService,
              public utilService: UtilService,) { }

  ngOnInit(): void {

    this.showApiService.findWithRootPath().subscribe({
      next: (result) => {
        this.showList = result
        this.showListFiltered = result
        console.log("result: ", this.showList)
      },
      error: err => {
        console.log("error: ", err)
      },
      complete: () => {}
    })

  }


  moveToMovieDetails(title: string) {
    this.router.navigate(['/movie-details', title])
      .catch(error => {
        console.error('❌ Błąd podczas nawigacji:', error);
      });
  }

  onFilterChange() {
    this.showListFiltered = this.showList;

    //ToDO to jest do zrobienia jak bede mial ogarniete kategorie show
    // this.showListFiltered = this.showListFiltered.filter(show => show.category == this.filterTypeValue);

    const filterText: string = this.utilService.normalizeText(this.filterTitleValue);


    this.showListFiltered = this.showListFiltered.filter(video =>
      this.utilService.normalizeText(video.name).includes(filterText)
    );
  }

  onFilterClearClick() {
    this.filterTitleValue = '';
    this.onFilterChange();
  }

  //ToDO to jest na kiedys do dodatkowego info na hover
  startHoverTimer(videoInfo: any) {
    this.hoverTimer = setTimeout(() => {
      this.onHoverOneSecond(videoInfo);
    }, 1000); // 1000 ms = 1 second
  }

  cancelHoverTimer() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }

  onHoverOneSecond(videoInfo: any) {
    console.log('Hovered for 1 second over:', videoInfo);
    // put your delayed hover action here
  }

}
