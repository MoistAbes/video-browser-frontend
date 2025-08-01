import {Component, Input, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgOptimizedImage} from '@angular/common';
import {VideoPlayerComponent} from '../../../../components/video-player-component/video-player-component';
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
  styleUrl: './single-movie-component.scss'
})
export class SingleMovieComponent {
  @Input() isVideoPlaying: boolean = false;
  @Input() videoData: any;
  @Input() selectedVideoUrl: string = '';
  @Input() subtitlesUrl: string = '';
  @Input() parentTitle: string = '';
  @Input() thumbnails: string[] = []


  @Input() playVideo!: () => void; // funkcja do wywołania play z zewnątrz


  getThumbnailUrl(fileName: string): string {
    return `${Endpoints.videos.icon}?path=${encodeURIComponent(this.videoData!.rootPath + '/thumbnails/' + fileName)}`;
  }

  getBackdropUrl(): string {
    return `${Endpoints.videos.icon}?path=${encodeURIComponent(this.videoData!.rootPath + '/backdrop/backdrop.jpg')}`;
  }

}
