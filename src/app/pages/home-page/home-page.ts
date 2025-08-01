import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {VideoInfoModel} from '../../models/video-info-model';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {VideoInfoTypeEnum} from '../../enums/video-info-type-enum';
import {VideoCardComponent} from '../../components/video-card-component/video-card-component';
import {VideoPlayerComponent} from '../../components/video-player-component/video-player-component';
import {Router} from '@angular/router';
import {VideoInfoApiService} from '../../services/api/video-info-api-service';

type VideoTypeOption = { label: string; value: VideoInfoTypeEnum }; // <-- TU

@Component({
  standalone: true,
  selector: 'app-home-page',
  imports: [
    FormsModule,
    FontAwesomeModule,
    VideoCardComponent,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss'
})
export class HomePage implements OnInit  {
  @ViewChild('target', { static: false }) target!: ElementRef;

  videoFileList: VideoInfoModel[] = []
  videoFileListFiltered: VideoInfoModel[] = []
  selectedVideoUrl: string = '';

  filterTitleValue: string = '';
  filterTypeValue: VideoInfoTypeEnum = VideoInfoTypeEnum.ALL;

  videoTypes: VideoTypeOption[] = [];

  constructor(private router: Router,
              private videoInfoApiService: VideoInfoApiService) { }

  ngOnInit(): void {
    this.videoInfoApiService.findAllVideoInfoParentTitle().subscribe({
      next: data => {
        this.videoFileList = data;
        this.videoFileListFiltered = data;

        console.log("Fetched video info list: ", this.videoFileList)
      },
      error: err => {
        console.log(err);
      }
    })

    this.videoTypes = Object.entries(VideoInfoTypeEnum).map(([key, value]) => ({
      label: value,
      value: value as VideoInfoTypeEnum
    }));
  }


  moveToMovieDetails(videoInfo: VideoInfoModel) {
    this.router.navigate(['/movie-details', videoInfo.title])
      .catch(error => {
        console.error('❌ Błąd podczas nawigacji:', error);
      });
  }

  onFilterChange() {
    this.videoFileListFiltered = this.videoFileList;

    if (this.filterTypeValue.toLowerCase() != "wszystko") {
      this.videoFileListFiltered = this.videoFileListFiltered.filter(video =>
        this.getTrimAndLowercase(video.type).includes(this.getTrimAndLowercase(this.filterTypeValue))
      )
    }

    this.videoFileListFiltered = this.videoFileListFiltered.filter(video =>
      this.getTrimAndLowercase(video.title).includes(this.getTrimAndLowercase(this.filterTitleValue))
    );

  }

  onFilterClearClick() {
    this.filterTitleValue = '';
    this.onFilterChange();
  }


  getTrimAndLowercase(value: string): string {
    return value.toLowerCase().replace(/\s+/g, '');
  }


}
