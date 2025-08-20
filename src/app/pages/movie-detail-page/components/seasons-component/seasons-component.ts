import {Component, Input, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output, OnInit} from '@angular/core';
import {VideoPlayerComponent} from '../../../../components/video-player-component/video-player-component';
import {NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ShowModel} from '../../../../models/show-model';
import {MediaItemModel} from '../../../../models/media-item-model';
import {UtilService} from '../../../../services/local/util-service';

@Component({
  selector: 'app-seasons-component',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    VideoPlayerComponent,
    NgOptimizedImage,
    FormsModule,
  ],
  templateUrl: './seasons-component.html',
  standalone: true,
  styleUrl: './seasons-component.scss'
})
export class SeasonsComponent implements OnInit {

  @Input() show: ShowModel | undefined;
  @Input() isVideoPlaying: boolean = false;
  @Input() currentMediaItem: MediaItemModel | undefined;
  @Input() selectedVideoUrl: string = '';
  @Input() selectedSeason: number | null = null

  @Output() updateMediaItem: EventEmitter<Partial<MediaItemModel>> = new EventEmitter<Partial<MediaItemModel>>();
  @Output() playVideoClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() seekChange: EventEmitter<number> = new EventEmitter<number>();

  episodes: MediaItemModel[] = [];
  selectedEpisode: MediaItemModel | undefined


  constructor(public utilService: UtilService) {
  }

  ngOnInit(): void {
    this.selectedSeason = this.show!.seasons[0].episodes[0].mediaItem.seasonNumber;
    this.setUpEpisodes();
  }

  setUpEpisodes() {
    console.log("Setup episodes");


    this.episodes = this.show?.seasons
      .filter(season => season.number == this.selectedSeason)
      .flatMap(season => season.episodes)
      .flatMap(episode => episode.mediaItem) || [];

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

}
