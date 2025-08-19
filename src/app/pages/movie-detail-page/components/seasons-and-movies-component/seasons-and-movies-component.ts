import {Component, Input, CUSTOM_ELEMENTS_SCHEMA, OnInit, Output, EventEmitter, OnChanges} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {VideoCardComponent} from '../../../../components/video-card-component/video-card-component';
import {VideoPlayerComponent} from '../../../../components/video-player-component/video-player-component';
import {NgOptimizedImage} from '@angular/common';
import {Endpoints} from '../../../../endpoints/endpoints';
import {VideoApi} from '../../../../services/api/video-api';
import {ShowModel} from '../../../../models/show-model';
import {MediaItemModel} from '../../../../models/media-item-model';

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
export class SeasonsAndMoviesComponent implements OnInit, OnChanges {

  @Input() currentMediaItem: MediaItemModel | undefined;
  @Input() isVideoPlaying: boolean = false;
  @Input() selectedVideoUrl: string = '';
  @Input() show: ShowModel | undefined;

  @Input() selectedSeason: number | null = null

  @Output() updateMediaItem = new EventEmitter<Partial<MediaItemModel>>();
  @Output() playVideoClicked = new EventEmitter<void>();

  selectedContentType: string = 'seasons';

  episodes: MediaItemModel[] = [];
  selectedEpisode: MediaItemModel | undefined

  private initialized = false;

  constructor() {}

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (!this.initialized && this.show?.seasons?.length) {
      this.initialized = true;
      this.selectedSeason = this.show.seasons[0].episodes[0].mediaItem.seasonNumber;
      this.setUpEpisodes();
    }
  }

  getBackdropUrl(): string {
    return `${Endpoints.videos.icon}?path=${encodeURIComponent(this.currentMediaItem!.rootPath + '/backdrop/backdrop.jpg')}`;
  }

  watchMovie(mediaItem: MediaItemModel) {

    console.log("watchMovie: ", mediaItem);

    this.currentMediaItem = mediaItem;
    this.updateMediaItem.emit(this.currentMediaItem);
    this.resetPlayingVideo()
  }

  resetPlayingVideo() {
    this.selectedVideoUrl = '';
    this.isVideoPlaying = false;
  }

  selectSeasonContentType() {
    this.selectedContentType = 'seasons';
    if (this.show) {
      this.selectedSeason = this.show.seasons[0].episodes[0].mediaItem.seasonNumber;
      this.setUpEpisodes();
    }

  }

  selectMoviesContentType() {
    this.selectedContentType = 'movies';
    this.currentMediaItem = this.show!.movies[0].mediaItem;
    this.updateMediaItem.emit(this.currentMediaItem)
    this.resetPlayingVideo()

  }

  setUpEpisodes() {
    console.log("Setup episodes");

    this.episodes = this.show?.seasons
      .filter(season => season.number == this.selectedSeason)
      .flatMap(season => season.episodes)
      .flatMap(episode => episode.mediaItem) || [];

    if (this.episodes.length > 0) {
      setTimeout(() => { // <-- opóźnienie do następnego cyklu
        this.selectedEpisode = this.episodes[0];
        this.updateMediaItem.emit(this.selectedEpisode);
      });
    }
  }

  onEpisodeSelect() {
    this.updateMediaItem.emit(this.selectedEpisode);
  }
}
