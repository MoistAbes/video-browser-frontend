import {Component, Input, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {VideoInfoModel} from '../../../../models/video-info-model';
import {FormsModule} from '@angular/forms';
import {VideoCardComponent} from '../../../../components/video-card-component/video-card-component';
import {VideoPlayerComponent} from '../../../../components/video-player-component/video-player-component';
import {NgOptimizedImage} from '@angular/common';
import {Endpoints} from '../../../../endpoints/endpoints';
import {VideoApi} from '../../../../services/api/video-api';

@Component({
  selector: 'app-seasons-and-movies-component',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    FormsModule,
    VideoCardComponent,
    VideoPlayerComponent,
    NgOptimizedImage
  ],
  templateUrl: './seasons-and-movies-component.html',
  styleUrl: './seasons-and-movies-component.scss'
})
export class SeasonsAndMoviesComponent implements OnInit {
  @Input() isVideoPlaying: boolean = false;
  @Input() videoData: any;
  @Input() thumbnails: string[] = [];
  @Input() selectedVideoUrl: string = '';
  @Input() parentTitle: string = '';
  @Input() seasons: number[] = []
  @Input() episodes: number[] = []
  @Input() videoInfoList: VideoInfoModel[] = []
  @Input() selectedSeason: number | undefined
  @Input() selectedEpisode: number | undefined
  @Input() movies: VideoInfoModel[] = [];

  selectedContentType: string = 'seasons';

  @Input() playVideo!: () => void; // funkcja do wywołania play z zewnątrz

  constructor(private videoApi: VideoApi) {}

  ngOnInit(): void {
    console.log("videos: ", this.videoInfoList);
    console.log("selected sesason: ", this.selectedSeason);
    console.log("selected episode: ", this.selectedEpisode);
  }



  getThumbnailUrl(fileName: string): string {
    return `${Endpoints.videos.icon}?path=${encodeURIComponent(this.videoData!.rootPath + '/thumbnails/' + fileName)}`;
  }

  getBackdropUrl(): string {
    return `${Endpoints.videos.icon}?path=${encodeURIComponent(this.videoData!.rootPath + '/backdrop/backdrop.jpg')}`;
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
      this.selectEpisode();
    }

  }

  selectEpisode() {
    console.log("selectEpisode");
    this.thumbnails = []
    this.videoInfoList.forEach((videoInfo: VideoInfoModel) => {
      if (videoInfo.videoDetails!.season == this.selectedSeason && videoInfo.videoDetails?.episode == this.selectedEpisode) {
        this.videoData = videoInfo;
        this.selectedVideoUrl = ''
        this.isVideoPlaying = false;
        return
      }
    })
  }

  watchMovie(videoInfo: VideoInfoModel) {
    this.videoData = videoInfo;
    this.loadVideoThumbnails()
    this.resetPlayingVideo()
  }

  loadVideoThumbnails() {
    this.thumbnails = []
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

  resetPlayingVideo() {
    this.selectedVideoUrl = '';
    this.isVideoPlaying = false;
  }

  selectSeasonContentType() {
    this.selectedContentType = 'seasons';
    this.selectEpisode();
  }

  selectMoviesContentType() {
    this.selectedContentType = 'movies';
    console.log("movies: ", this.movies);
    this.videoData = this.movies[0];
    this.loadVideoThumbnails()
    this.resetPlayingVideo()

  }
}
