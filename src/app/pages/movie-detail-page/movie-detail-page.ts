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
  currentMediaItem: MediaItemModel | undefined;
  selectedVideoUrl: string = '';
  subtitlesUrl: string = '';

  selectedSeason: number | null = null

  isVideoPlaying: boolean = false;
  private seekStartTime: number = 0;

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


  onUpdateVideoData(update: Partial<MediaItemModel>) {
    console.log("onUpdateVideoData: ", update);
    this.currentMediaItem = { ...this.currentMediaItem, ...update } as MediaItemModel;

    //reset video data
    this.isVideoPlaying = false;
    this.selectedVideoUrl = '';
  }

  private updateVideoUrl() {
    if (!this.currentMediaItem) return;

    const fullVideoPath: string = `${this.currentMediaItem.rootPath}/${this.currentMediaItem.fileName}`;
    const needsConversion: boolean = !['aac', 'mp3'].includes(this.currentMediaItem.audio!);

    if (needsConversion) {
      this.selectedVideoUrl =
        `${Endpoints.stream.convert}?path=${encodeURIComponent(fullVideoPath)}&start=${this.seekStartTime}`;
    } else {
      this.selectedVideoUrl =
        `${Endpoints.stream.normal}?path=${encodeURIComponent(fullVideoPath)}`;
    }
  }


  playVideo() {

    if (!this.currentMediaItem) return;

    console.log("playVideo: ", this.currentMediaItem);
    this.isVideoPlaying = true;

    this.updateVideoUrl()

    // Ustawienie napisów
    const subtitleName = this.currentMediaItem.title;
    const rootPath = encodeURIComponent(this.currentMediaItem.rootPath);
    this.subtitlesUrl = `${Endpoints.videos.subtitles}/${encodeURIComponent(subtitleName)}?path=${rootPath}`;

    console.log("subtitle path: ", this.subtitlesUrl);
  }

  onSeekTimeSelected(time: number) {
    console.log("Otrzymany czas z dziecka:", time);
    this.seekStartTime = time;
    this.updateVideoUrl()



  }


  determineVideoCategory() {
    if (this.isSingleMovie()) {

      this.contentType = 'single';
      this.currentMediaItem = this.show!.movies[0].mediaItem!;


    } else if (this.isSeasonOnly()) {

      this.contentType = 'seasons';
      this.currentMediaItem = this.show!.seasons[0].episodes[0].mediaItem!;



    } else if (this.hasOnlyMovies()) {

      this.contentType = 'series';


    } else if (this.hasMoviesAndSeasons()) {

      this.contentType = 'seasons-and-movies';
    }

  }

  private isSingleMovie(): boolean {
    return this.show?.seasons.length == 0 &&
      this.show.movies.length == 1
  }

  private isSeasonOnly(): boolean {
    return this.show!.seasons.length > 0 &&
      this.show?.movies.length == 0
  }

  private hasOnlyMovies(): boolean {
    return this.show?.seasons.length == 0 &&
      this.show.movies.length > 1
  }

  private hasMoviesAndSeasons(): boolean {
    return this.show!.seasons.length > 0 &&
      this.show!.movies.length > 0
  }
}
