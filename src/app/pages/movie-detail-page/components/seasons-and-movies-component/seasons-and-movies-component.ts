import {Component, Input, CUSTOM_ELEMENTS_SCHEMA, OnInit, Output, EventEmitter} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {VideoCardComponent} from '../../../../components/video-card-component/video-card-component';
import {VideoPlayerComponent} from '../../../../components/video-player-component/video-player-component';
import {NgOptimizedImage} from '@angular/common';
import {Endpoints} from '../../../../endpoints/endpoints';
import {VideoApi} from '../../../../services/api/video-api';
import {EpisodeModel} from '../../../../models/episode-model';
import {ShowModel} from '../../../../models/show-model';

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
  standalone: true,
  styleUrl: './seasons-and-movies-component.scss'
})
export class SeasonsAndMoviesComponent implements OnInit {

  // @Input() currentVideoInfo: VideoInfoModel | undefined;
  @Input() isVideoPlaying: boolean = false;
  @Input() selectedVideoUrl: string = '';
  @Input() show: ShowModel | undefined;

  @Input() selectedSeason: number | undefined

  // @Output() updateVideoData = new EventEmitter<Partial<VideoInfoModel>>();
  @Output() playVideoClicked = new EventEmitter<void>();

  selectedContentType: string = 'seasons';

  episodes: EpisodeModel[] = [];
  selectedEpisode: EpisodeModel | undefined

  constructor(private videoApi: VideoApi) {}

  ngOnInit(): void {
    this.selectedSeason = this.show?.seasons[0].number;
    this.setUpEpisodes();
  }

  // getBackdropUrl(): string {
  //   return `${Endpoints.videos.icon}?path=${encodeURIComponent(this.currentVideoInfo!.rootPath + '/backdrop/backdrop.jpg')}`;
  // }



  // watchMovie(videoInfo: VideoInfoModel) {
  //   console.log("watch movie: ", videoInfo);
  //   this.currentVideoInfo = videoInfo;
  //   this.updateVideoData.emit(this.currentVideoInfo)
  //   this.resetPlayingVideo()
  // }

  resetPlayingVideo() {
    this.selectedVideoUrl = '';
    this.isVideoPlaying = false;
  }

  selectSeasonContentType() {
    this.selectedContentType = 'seasons';
  }

  selectMoviesContentType() {
    this.selectedContentType = 'movies';
    // this.currentVideoInfo = this.show!.movies[0].videoInfo;
    // this.updateVideoData.emit(this.currentVideoInfo)
    this.resetPlayingVideo()

  }

  setUpEpisodes() {
    console.log("Setup episodes");

    this.episodes = this.show?.seasons
      .filter(season => season.number == this.selectedSeason)
      .flatMap(season => season.episodes) || [];

    if (this.episodes.length > 0) {
      this.selectedEpisode = this.episodes[0];
      // this.updateVideoData.emit(this.selectedEpisode.videoInfo);
    }
  }

  onEpisodeSelect() {
    // this.updateVideoData.emit(this.selectedEpisode!.videoInfo);
  }
}
