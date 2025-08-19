import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {VideoInfoTypeEnum} from '../../enums/video-info-type-enum';
import {VideoCardComponent} from '../../components/video-card-component/video-card-component';
import {Router} from '@angular/router';
import {MainIconPathPipe} from '../../pipes/main-icon-path-pipe';
import {ShowApiService} from '../../services/api/show-api-service';
import {ShowModel} from '../../models/show-model';

type VideoTypeOption = { label: string; value: VideoInfoTypeEnum };

@Component({
  standalone: true,
  selector: 'app-search-page',
  imports: [
    FormsModule,
    FontAwesomeModule,
    VideoCardComponent,
    MainIconPathPipe,
  ],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss'
})
export class SearchPage implements OnInit  {
  @ViewChild('target', { static: false }) target!: ElementRef;

  filterTitleValue: string = '';
  filterTypeValue: VideoInfoTypeEnum = VideoInfoTypeEnum.ALL;

  videoTypes: VideoTypeOption[] = [];
  hoverTimer: number | null = null;

  showList: ShowModel[] = []
  showListFiltered: ShowModel[] = []

  constructor(private router: Router,
              private showApiService: ShowApiService,) { }

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

    this.videoTypes = Object.entries(VideoInfoTypeEnum).map(([key, value]) => ({
      label: value,
      value: value as VideoInfoTypeEnum
    }));
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

    this.showListFiltered = this.showListFiltered.filter(video =>
      this.getTrimAndLowercase(video.name).includes(this.getTrimAndLowercase(this.filterTitleValue))
    );

  }

  onFilterClearClick() {
    this.filterTitleValue = '';
    this.onFilterChange();
  }


  getTrimAndLowercase(value: string): string {
    return value.toLowerCase().replace(/\s+/g, '');
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
