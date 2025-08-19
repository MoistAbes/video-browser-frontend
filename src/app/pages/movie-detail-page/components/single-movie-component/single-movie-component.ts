import {Component, Input, CUSTOM_ELEMENTS_SCHEMA, Output, EventEmitter} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgOptimizedImage} from '@angular/common';
import {VideoPlayerComponent} from '../../../../components/video-player-component/video-player-component';
import {ShowModel} from '../../../../models/show-model';
import {MediaItemModel} from '../../../../models/media-item-model';
import {Endpoints} from '../../../../endpoints/endpoints';

@Component({
  selector: 'app-single-movie-component',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    FormsModule,
    NgOptimizedImage,
    VideoPlayerComponent
  ],
  templateUrl: './single-movie-component.html',
  standalone: true,
  styleUrl: './single-movie-component.scss'
})
export class SingleMovieComponent {
  @Input() show: ShowModel | undefined;
  @Input() isVideoPlaying: boolean = false;
  @Input() currentMediaItem: MediaItemModel | undefined;
  @Input() selectedVideoUrl: string = '';
  @Input() subtitlesUrl: string = '';
  @Output() playVideoClicked = new EventEmitter<void>();
  @Output() updateMediaItem = new EventEmitter<Partial<MediaItemModel>>();



  getBackdropUrl(): string {
    return `${Endpoints.videos.icon}?path=${encodeURIComponent(this.currentMediaItem!.rootPath + '/backdrop/backdrop.jpg')}`;
  }

}
