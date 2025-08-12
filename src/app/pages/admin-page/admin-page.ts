import {Component, OnInit} from '@angular/core';
import {VideoApi} from '../../services/api/video-api';
import {FormsModule} from '@angular/forms';
import {ShowApiService} from '../../services/api/show-api-service';

@Component({
  selector: 'app-admin-page',
  imports: [
    FormsModule
  ],
  templateUrl: './admin-page.html',
  standalone: true,
  styleUrl: './admin-page.scss'
})
export class AdminPage implements OnInit {

  // videoInfoList: VideoInfoModel[] = []
  // videoInfoListFiltered: VideoInfoModel[] = []

  audioFilterValue: string = ''

  constructor(private videoApiService: VideoApi,
              private showApiService: ShowApiService,) {}

  ngOnInit(): void {
    // this.videoStoreService.getAllVideos().subscribe({
    //   next: (videos) => {
    //     this.videoInfoList = videos
    //     this.videoInfoListFiltered = videos
    //   },
    //   error: (err) => console.error('Błąd przy ładowaniu listy filmów:', err)
    // });

  }

  // findAllParentTitle() {
  //   this.videoInfoApiService.findAllVideoInfoParentTitle().subscribe({
  //     next: (videos) => {
  //       console.log(videos);
  //     },
  //     error: (err) => {
  //       console.log(err)
  //     },
  //     complete: () => {}
  //   })
  // }

  scanAllMovies() {
    console.log('ScanAllMovies');
    this.videoApiService.scanAllVideos().subscribe({
      next: (result) => {

      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('ScanAllMovies complete');
      }
    })
  }

  filterVideoInfo() {

    // this.videoInfoListFiltered = this.videoInfoList;
    //
    // this.videoInfoListFiltered = this.videoInfoListFiltered.filter(videoInfo =>
    //   videoInfo.videoTechnicalDetails?.audio.includes(this.audioFilterValue)
    // );
  }


  testSubtitleEndpoint() {
    this.videoApiService.getSubtitles('MOVIE/Fast and Furious/Fast and Furious 1', 'Fast and Furious 1').subscribe({
      next: (result) => {},
      error: (err) => {},
      complete: () => {}
    })
  }

  testFindAllShows() {
    this.showApiService.findAllShows().subscribe({
      next: (result) => {
        console.log("SHOWS: ", result);
      },
      error: (err) => {
        console.log("Error while loading shows: ", err);
      },
      complete: () => {}
    })
  }
}
