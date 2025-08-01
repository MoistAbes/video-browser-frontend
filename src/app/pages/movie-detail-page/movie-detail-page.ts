import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {VideoInfoModel} from '../../models/video-info-model';
import {Endpoints} from '../../endpoints/endpoints';
import {VideoInfoApiService} from '../../services/api/video-info-api-service';
import {FormsModule} from '@angular/forms';
import {VideoApi} from '../../services/api/video-api';
import {SingleMovieComponent} from './components/single-movie-component/single-movie-component';
import {SeasonsComponent} from './components/seasons-component/seasons-component';
import {SeriesComponent} from './components/series-component/series-component';
import {SeasonsAndMoviesComponent} from './components/seasons-and-movies-component/seasons-and-movies-component';

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

  parentTitle: string = '';
  videoInfoList: VideoInfoModel[] = [];
  videoData: VideoInfoModel | null = null;
  selectedVideoUrl: string = '';
  subtitlesUrl: string = '';

  seasons: number[] = []
  episodes: number[] = []
  movies: VideoInfoModel[] = [];

  selectedSeason: number | undefined
  selectedEpisode: number | undefined

  thumbnails: string[] = []

  isVideoPlaying: boolean = false;

  constructor(private route: ActivatedRoute,
              private videoApi: VideoApi,
              private videoInfoApiService: VideoInfoApiService,) {}

  ngOnInit() {
    this.parentTitle = this.route.snapshot.params['parentTitle'];

    this.videoInfoApiService.findAllVideoInfoByParentTitle(this.parentTitle).subscribe({
      next: data => {
        this.videoInfoList = data;
        console.log("find by parent title", this.videoInfoList);
        this.determineVideoCategory();
      },
      error: err => {
        console.log(err);
      },
      complete: () => {

      }
    })
  }


  loadVideoThumbnails() {
    this.videoApi.getThumbnails(this.videoData!.rootPath).subscribe({
      next: data => {
        this.thumbnails = data;
      },
      error: err => {
        console.log(err);
      },
      complete: () => {}
    })
  }

  playVideo() {
    if (this.videoData) {
      this.isVideoPlaying = true;

      const fullVideoPath = `${this.videoData.rootPath}/${this.videoData.videoDetails!.fileName}`;
      this.selectedVideoUrl = `${Endpoints.videos.stream}?path=${encodeURIComponent(fullVideoPath)}`;

      const subtitleName = this.videoData.title; // assuming this matches the subtitle file name
      const rootPath = encodeURIComponent(this.videoData.rootPath);

      this.subtitlesUrl = `${Endpoints.videos.subtitles}/${encodeURIComponent(subtitleName)}?path=${rootPath}`;
      console.log('subtitlesUrl', this.subtitlesUrl);
    }
  }


  setUpMovies() {
    this.videoInfoList.forEach((videoInfo: VideoInfoModel) => {
      if (videoInfo.videoDetails?.episode == null && videoInfo.videoDetails?.episode == null) {
        this.movies.push(videoInfo);
      }
    })
  }


  setUpSeasons() {
    this.videoInfoList.forEach((videoInfo: VideoInfoModel) => {
      if (!this.seasons.includes(videoInfo.videoDetails!.season) && videoInfo.videoDetails!.season !=  null) {
          this.seasons.push(videoInfo.videoDetails!.season);
      }
    })

    if (this.seasons.length > 0) {
      this.selectedSeason = this.seasons[0];
      this.setUpEpisodes()
    }

  }

  setUpEpisodes() {

    this.episodes = []

    this.videoInfoList.forEach((videoInfo: VideoInfoModel) => {
      if (videoInfo.videoDetails?.season == this.selectedSeason) {
        this.episodes.push(videoInfo.videoDetails!.episode);
      }
    })

    if (this.episodes.length > 0) {
      this.selectedEpisode = this.episodes[0];
      this.watchEpisode();
    }

  }


  watchEpisode() {

    this.videoInfoList.forEach((videoInfo: VideoInfoModel) => {
      if (videoInfo.videoDetails!.season == this.selectedSeason && videoInfo.videoDetails?.episode == this.selectedEpisode) {
        this.videoData = videoInfo;
        this.selectedVideoUrl = ''
        this.isVideoPlaying = false;
        return
      }
    })
  }

  determineVideoCategory() {
    if (this.isSingleMovie()) {
      this.contentType = 'single';
      this.videoData = this.videoInfoList[0];
      this.loadVideoThumbnails();
    } else if (this.isSeasonOnly()) {
      this.setUpSeasons();
      this.contentType = 'seasons';
    } else if (this.hasOnlyMovies()) {
      this.contentType = 'series';
    } else if (this.hasMoviesAndSeasons()) {
      this.contentType = 'seasons-and-movies';
    }


  }

  private isSingleMovie(): boolean {
    return this.videoInfoList.length === 1 &&
      this.videoInfoList[0].videoDetails?.season == null &&
      this.videoInfoList[0].videoDetails?.episode == null;
  }

  private isSeasonOnly(): boolean {
    return this.videoInfoList.every(videoInfo =>
      videoInfo.videoDetails?.season != null || videoInfo.videoDetails?.episode != null
    );
  }


  private hasOnlyMovies(): boolean {
    this.setUpMovies();
    this.setUpSeasons();
    return this.movies.length > 0 && this.seasons.length === 0;
  }

  private hasMoviesAndSeasons(): boolean {
    return this.movies.length > 0 && this.seasons.length > 0;
  }


}
