import {
  Component,
  Input,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Output,
  OnInit,
} from '@angular/core';
import { VideoPlayerComponent } from '../../../../components/video-player-component/video-player-component';
import { FormsModule } from '@angular/forms';
import { ShowModel } from '../../../../models/show/show-model';
import { MediaItemModel } from '../../../../models/show/media-item-model';
import { UtilService } from '../../../../services/local/util-service';
import { ShowUtilService } from '../../../../services/local/show-util-service';
import { SubtitleModel } from '../../../../models/show/subtitle-model';

@Component({
  selector: 'app-seasons-component',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [VideoPlayerComponent, FormsModule],
  templateUrl: './seasons-component.html',
  standalone: true,
  styleUrl: './seasons-component.scss',
})
export class SeasonsComponent implements OnInit {
  @Input() show: ShowModel | undefined;
  @Input() isVideoPlaying: boolean = false;
  @Input() currentMediaItem: MediaItemModel | undefined;
  @Input() selectedVideoUrl: string = '';
  @Input() selectedSeason: number | null = null;
  @Input() subtitlesUrl: string = '';
  @Input() backdropImagePath: string = '';
  @Input() selectedSubtitlesInput: SubtitleModel | undefined;


  @Output() updateMediaItem: EventEmitter<Partial<MediaItemModel>> = new EventEmitter<
    Partial<MediaItemModel>
  >();
  @Output() playVideoClicked = new EventEmitter<void>();
  @Output() seekChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() selectedSubtitles = new EventEmitter<SubtitleModel>();



  episodes: MediaItemModel[] = [];
  selectedEpisode: MediaItemModel | undefined;

  constructor(public utilService: UtilService, private showUtilService: ShowUtilService) {}

  ngOnInit(): void {
    this.selectedSeason = this.show!.seasons[0].episodes[0].seasonNumber;
    this.setUpEpisodes();
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

  onSeekTimeSelected(time: number) {
    // np. ustawiamy nowy URL streamu
    this.seekChange.emit(time); // wysyłamy wartość do rodzica
  }

  onSelectedSubtitles(selectedSubtitles: SubtitleModel) {
    console.log('selected subtitles in seasons and movies component: ', selectedSubtitles);

    this.selectedSubtitles.emit(selectedSubtitles);
  }
}
