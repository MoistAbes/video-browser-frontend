import {Component, Input, CUSTOM_ELEMENTS_SCHEMA, Output, EventEmitter} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgOptimizedImage} from '@angular/common';
import {VideoPlayerComponent} from '../../../../components/video-player-component/video-player-component';
import {Endpoints} from '../../../../endpoints/endpoints';
import {ShowModel} from '../../../../models/show-model';

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
  // @Input() currentVideoInfo: VideoInfoModel | undefined;
  @Input() selectedVideoUrl: string = '';
  @Input() subtitlesUrl: string = '';
  @Output() playVideoClicked = new EventEmitter<void>();
  // @Output() updateVideoData = new EventEmitter<Partial<VideoInfoModel>>();



  // getBackdropUrl(): string {
  //   return `${Endpoints.videos.icon}?path=${encodeURIComponent(this.currentVideoInfo!.rootPath + '/backdrop/backdrop.jpg')}`;
  // }

}
