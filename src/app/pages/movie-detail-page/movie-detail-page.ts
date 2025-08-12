import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Endpoints} from '../../endpoints/endpoints';
import {FormsModule} from '@angular/forms';
import {SingleMovieComponent} from './components/single-movie-component/single-movie-component';
import {SeasonsComponent} from './components/seasons-component/seasons-component';
import {SeriesComponent} from './components/series-component/series-component';
import {SeasonsAndMoviesComponent} from './components/seasons-and-movies-component/seasons-and-movies-component';
import {ShowApiService} from '../../services/api/show-api-service';
import {ShowModel} from '../../models/show-model';
import {MediaItemModel} from '../../models/media-item-model';

@Component({
  standalone: true,
  selector: 'app-movie-detail-page',
  imports: [
    FormsModule,
    SingleMovieComponent,
    SeasonsComponent,
    SeriesComponent,
    SeasonsAndMoviesComponent,
  ],
  templateUrl: './movie-detail-page.html',
  styleUrl: './movie-detail-page.scss'
})
export class MovieDetailPage implements OnInit {

  contentType: 'single' | 'series' | 'seasons' | 'seasons-and-movies' | undefined;
  show: ShowModel | undefined;
  // currentVideoInfo: VideoInfoModel = new VideoInfoModel();
  currentMediaItem: MediaItemModel | undefined;
  selectedVideoUrl: string = '';
  subtitlesUrl: string = '';

  selectedSeason: number | undefined

  isVideoPlaying: boolean = false;

  constructor(private route: ActivatedRoute,
              private showApiService: ShowApiService,) {}

  ngOnInit() {
    const parentTitle: string = this.route.snapshot.params['parentTitle'];
    this.findShowDetailByParentTitle(parentTitle);

  }

  findShowDetailByParentTitle(parentTitle: string): void {
    this.showApiService.findShowByParentTitle(parentTitle).subscribe({
      next: data => {
        this.show = data;
        console.log("show details: ", this.show);

      },
      error: err => {
        console.log("Error while findShowDetailByParentTitle: ", err);
      },
      complete: () => {
        this.determineVideoCategory();

      }
    })
  }


  // onUpdateVideoData(update: Partial<VideoInfoModel>) {
  //   console.log("onUpdateVideoData: ", update);
  //   this.currentVideoInfo = { ...this.currentVideoInfo, ...update } as VideoInfoModel;
  //
  //   //reset video data
  //   this.isVideoPlaying = false;
  //   this.selectedVideoUrl = '';
  // }


  // playVideo() {
  //   if (this.currentVideoInfo) {
  //
  //     console.log("playVideo: ", this.currentVideoInfo);
  //
  //     this.isVideoPlaying = true;
  //
  //     const fullVideoPath = `${this.currentVideoInfo.rootPath}/${this.currentVideoInfo.videoDetails!.fileName}`;
  //     this.selectedVideoUrl = `${Endpoints.videos.stream}?path=${encodeURIComponent(fullVideoPath)}`;
  //
  //     const subtitleName = this.currentVideoInfo.title; // assuming this matches the subtitle file name
  //     const rootPath = encodeURIComponent(this.currentVideoInfo.rootPath);
  //
  //     this.subtitlesUrl = `${Endpoints.videos.subtitles}/${encodeURIComponent(subtitleName)}?path=${rootPath}`;
  //   }
  //
  // }

  determineVideoCategory() {
    if (this.isSingleMovie2()) {

      this.contentType = 'single';
      this.currentMediaItem = this.show!.movies[0].mediaItem!;


    } else if (this.isSeasonOnly2()) {

      this.contentType = 'seasons';
      this.currentMediaItem = this.show!.seasons[0].episodes[0].mediaItem!;



    } else if (this.hasOnlyMovies2()) {

      this.contentType = 'series';


    } else if (this.hasMoviesAndSeasons2()) {

      this.contentType = 'seasons-and-movies';
    }

  }

  private isSingleMovie2(): boolean {
    return this.show?.seasons.length == 0 &&
      this.show.movies.length == 1
  }

  private isSeasonOnly2(): boolean {
    return this.show!.seasons.length > 0 &&
      this.show?.movies.length == 0
  }

  private hasOnlyMovies2(): boolean {
    return this.show?.seasons.length == 0 &&
      this.show.movies.length > 1
  }

  private hasMoviesAndSeasons2(): boolean {
    return this.show!.seasons.length > 0 &&
      this.show!.movies.length > 0
  }
}
