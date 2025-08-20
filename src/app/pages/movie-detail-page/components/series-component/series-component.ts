import {Component, Input, CUSTOM_ELEMENTS_SCHEMA, OnInit, Output, EventEmitter} from '@angular/core';
import {VideoPlayerComponent} from '../../../../components/video-player-component/video-player-component';
import {VideoCardComponent} from '../../../../components/video-card-component/video-card-component';
import {ShowModel} from '../../../../models/show-model';
import {MediaItemModel} from '../../../../models/media-item-model';
import {NgOptimizedImage} from '@angular/common';
import {UtilService} from '../../../../services/local/util-service';

@Component({
  selector: 'app-series-component',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    VideoPlayerComponent,
    VideoCardComponent,
    NgOptimizedImage
  ],
  templateUrl: './series-component.html',
  standalone: true,
  styleUrl: './series-component.scss'
})
export class SeriesComponent implements OnInit {
  @Input() currentMediaItem: MediaItemModel | undefined;
  @Input() show: ShowModel | undefined;

  @Input() isVideoPlaying: boolean = false;
  @Input() selectedVideoUrl: string = '';
  @Input() subtitlesUrl: string = '';

  @Output() updateVideoData = new EventEmitter<Partial<MediaItemModel>>();
  @Output() playVideoClicked = new EventEmitter<void>();


  constructor(public utilService: UtilService) {}

  ngOnInit(): void {
    this.currentMediaItem = this.show?.movies[0].mediaItem;
    this.updateVideoData.emit(this.currentMediaItem);
  }

  watchMovie(mediaItem: MediaItemModel) {

    console.log("watchMovie: ", mediaItem);

    this.currentMediaItem = mediaItem;
    this.updateVideoData.emit(this.currentMediaItem);
    this.resetPlayingVideo()
  }

  resetPlayingVideo() {
    this.selectedVideoUrl = '';
    this.isVideoPlaying = false;
  }

}
