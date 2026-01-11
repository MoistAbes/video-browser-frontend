import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { VideoPlayerComponent } from '../../../../components/video-player-component/video-player-component';
import { ShowModel } from '../../../../models/show/show-model';
import { MediaItemModel } from '../../../../models/show/media-item-model';
import { UtilService } from '../../../../services/local/util-service';
import { SubtitleModel } from '../../../../models/show/subtitle-model';

@Component({
  selector: 'app-single-movie-component',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [FormsModule, NgOptimizedImage, VideoPlayerComponent],
  templateUrl: './single-movie-component.html',
  standalone: true,
  styleUrl: './single-movie-component.scss',
})
export class SingleMovieComponent {
  @Input() show: ShowModel | undefined;
  @Input() isVideoPlaying: boolean = false;
  @Input() currentMediaItem: MediaItemModel | undefined;
  @Input() backdropImagePath: string = '';
  @Input() selectedVideoUrl: string = '';
  @Input() subtitlesUrl: string = '';
  @Input() selectedSubtitlesInput: SubtitleModel | undefined;

  @Output() playVideoClicked = new EventEmitter<void>();
  @Output() updateMediaItem = new EventEmitter<Partial<MediaItemModel>>();

  constructor(public utilService: UtilService) {}
}
