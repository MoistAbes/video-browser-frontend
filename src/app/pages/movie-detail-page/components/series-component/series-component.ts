import {Component, Input, CUSTOM_ELEMENTS_SCHEMA, OnInit, Output, EventEmitter} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {Endpoints} from '../../../../endpoints/endpoints';
import {VideoPlayerComponent} from '../../../../components/video-player-component/video-player-component';
import {VideoCardComponent} from '../../../../components/video-card-component/video-card-component';
import {VideoApi} from '../../../../services/api/video-api';
import {ShowModel} from '../../../../models/show-model';

@Component({
  selector: 'app-series-component',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    VideoPlayerComponent,
    VideoCardComponent
  ],
  templateUrl: './series-component.html',
  standalone: true,
  styleUrl: './series-component.scss'
})
export class SeriesComponent implements OnInit {
  // @Input() currentVideoInfo: VideoInfoModel | undefined;
  @Input() show: ShowModel | undefined;

  @Input() isVideoPlaying: boolean = false;
  @Input() selectedVideoUrl: string = '';
  @Input() subtitlesUrl: string = '';

  // @Output() updateVideoData = new EventEmitter<Partial<VideoInfoModel>>();
  @Output() playVideoClicked = new EventEmitter<void>();


  constructor(private videoApi: VideoApi) {}

  ngOnInit(): void {
    // this.currentVideoInfo = this.show?.movies[0].videoInfo;
    // this.updateVideoData.emit(this.currentVideoInfo);
  }

  // watchMovie(videoInfo: VideoInfoModel) {
  //
  //   console.log("watchMovie: ", videoInfo);
  //
  //   this.currentVideoInfo = videoInfo;
  //   this.updateVideoData.emit(this.currentVideoInfo);
  //   this.resetPlayingVideo()
  // }


  resetPlayingVideo() {
    this.selectedVideoUrl = '';
    this.isVideoPlaying = false;
  }


}
