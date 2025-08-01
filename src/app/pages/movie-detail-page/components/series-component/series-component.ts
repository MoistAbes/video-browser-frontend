import {Component, Input, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {VideoInfoModel} from '../../../../models/video-info-model';
import {NgOptimizedImage} from '@angular/common';
import {Endpoints} from '../../../../endpoints/endpoints';
import {VideoPlayerComponent} from '../../../../components/video-player-component/video-player-component';
import {VideoCardComponent} from '../../../../components/video-card-component/video-card-component';
import {VideoApi} from '../../../../services/api/video-api';

@Component({
  selector: 'app-series-component',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    NgOptimizedImage,
    VideoPlayerComponent,
    VideoCardComponent
  ],
  templateUrl: './series-component.html',
  styleUrl: './series-component.scss'
})
export class SeriesComponent implements OnInit {
  @Input() isVideoPlaying: boolean = false;
  @Input() videoData: any;
  @Input() thumbnails: string[] = [];
  @Input() selectedVideoUrl: string = '';
  @Input() subtitlesUrl: string = '';
  @Input() parentTitle: string = '';
  @Input() videoInfoList: VideoInfoModel[] = []

  @Input() playVideo!: () => void; // funkcja do wywołania play z zewnątrz

  constructor(private videoApi: VideoApi) {}

  ngOnInit(): void {
    console.log('Series Component loaded.', this.videoInfoList);
  }


  getThumbnailUrl(fileName: string): string {
    return `${Endpoints.videos.icon}?path=${encodeURIComponent(this.videoData!.rootPath + '/thumbnails/' + fileName)}`;
  }



  watchMovie(videoInfo: VideoInfoModel) {
    this.videoData = videoInfo;
    this.loadVideoThumbnails()
    this.resetPlayingVideo()
  }

  loadVideoThumbnails() {
    this.videoApi.getThumbnails(this.videoData!.rootPath).subscribe({
      next: data => {
        this.thumbnails = data;
        console.log("thumbnails: ", this.thumbnails);
      },
      error: err => {
        console.log(err);
      },
      complete: () => {}
    })
  }

  resetPlayingVideo() {
    this.selectedVideoUrl = '';
    this.isVideoPlaying = false;
  }


}
