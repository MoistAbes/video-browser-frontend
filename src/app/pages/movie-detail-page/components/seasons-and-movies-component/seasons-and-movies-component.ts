import {
  Component,
  Input,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VideoCardComponent } from '../../../../components/video-card-component/video-card-component';
import { VideoPlayerComponent } from '../../../../components/video-player-component/video-player-component';
import { ShowModel } from '../../../../models/show/show-model';
import { MediaItemModel } from '../../../../models/show/media-item-model';
import { UtilService } from '../../../../services/local/util-service';
import { ShowUtilService } from '../../../../services/local/show-util-service';
import { SubtitleModel } from '../../../../models/show/subtitle-model';

@Component({
  selector: 'app-seasons-and-movies-component',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [FormsModule, VideoCardComponent, VideoPlayerComponent],
  templateUrl: './seasons-and-movies-component.html',
  standalone: true,
  styleUrl: './seasons-and-movies-component.scss',
})
export class SeasonsAndMoviesComponent implements OnInit, OnChanges {
  @Input() currentMediaItem: MediaItemModel | undefined;
  @Input() isVideoPlaying: boolean = false;
  @Input() selectedVideoUrl: string = '';
  @Input() subtitlesUrl: string = '';
  @Input() show: ShowModel | undefined;
  @Input() selectedSeason: number | null = null;
  @Input() backdropImagePath: string = '';
  @Input() selectedSubtitlesInput: SubtitleModel | undefined;

  @Output() updateMediaItem: EventEmitter<Partial<MediaItemModel>> = new EventEmitter<
    Partial<MediaItemModel>
  >();
  @Output() playVideoClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() selectedSubtitles = new EventEmitter<SubtitleModel>();

  selectedContentType: string = 'seasons';

  episodes: MediaItemModel[] = [];
  selectedEpisode: MediaItemModel | undefined;

  private initialized: boolean = false;

  constructor(public utilService: UtilService, private showUtilService: ShowUtilService) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (!this.initialized && this.show?.seasons?.length) {
      this.initialized = true;
      this.selectedSeason = this.show.seasons[0].episodes[0].seasonNumber;
      this.setUpEpisodes();
    }
  }

  watchMovie(mediaItem: MediaItemModel) {
    this.currentMediaItem = mediaItem;
    this.updateMediaItem.emit(this.currentMediaItem);
    this.resetPlayingVideo();
  }

  resetPlayingVideo() {
    this.selectedVideoUrl = '';
    this.isVideoPlaying = false;
  }

  selectSeasonContentType() {
    this.selectedContentType = 'seasons';
    if (this.show) {
      this.selectedSeason = this.show.seasons[0].episodes[0].seasonNumber;
      this.setUpEpisodes();
    }
  }

  selectMoviesContentType() {
    this.selectedContentType = 'movies';
    this.currentMediaItem = this.show!.movies[0];
    this.updateMediaItem.emit(this.currentMediaItem);
    this.resetPlayingVideo();
  }

  setUpEpisodes() {
    this.episodes = this.showUtilService.getEpisodesForSeason(this.show, this.selectedSeason);

    if (this.episodes.length > 0) {
      this.selectedEpisode = this.episodes[0];
      this.updateMediaItem.emit(this.selectedEpisode);
    }
  }

  onEpisodeSelect() {
    this.updateMediaItem.emit(this.selectedEpisode);
  }

  onSelectedSubtitles(selectedSubtitles: SubtitleModel) {
    console.log('selected subtitles in seasons and movies component: ', selectedSubtitles);

    this.selectedSubtitles.emit(selectedSubtitles);
  }
}
