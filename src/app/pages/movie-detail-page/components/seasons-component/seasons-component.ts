import {Component, Input, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {Endpoints} from '../../../../endpoints/endpoints';
import {VideoPlayerComponent} from '../../../../components/video-player-component/video-player-component';
import {NgOptimizedImage} from '@angular/common';
import {VideoInfoModel} from '../../../../models/video-info-model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-seasons-component',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    VideoPlayerComponent,
    NgOptimizedImage,
    FormsModule,
  ],
  templateUrl: './seasons-component.html',
  styleUrl: './seasons-component.scss'
})
export class SeasonsComponent implements OnInit {
  @Input() isVideoPlaying: boolean = false;
  @Input() videoData: any;
  @Input() thumbnails: string[] = [];
  @Input() selectedVideoUrl: string = '';
  @Input() parentTitle: string = '';
  @Input() seasons: number[] = []
  @Input() selectedSeason: number | undefined
  @Input() episodes: number[] = []
  @Input() selectedEpisode: number | undefined

  @Input() videoInfoList: VideoInfoModel[] = []


  ngOnInit(): void {

  }

  @Input() playVideo!: () => void; // funkcja do wywołania play z zewnątrz

  getThumbnailUrl(fileName: string): string {
    return `${Endpoints.videos.icon}?path=${encodeURIComponent(this.videoData!.rootPath + '/thumbnails/' + fileName)}`;
  }

  getBackdropUrl(): string {
    return `${Endpoints.videos.icon}?path=${encodeURIComponent(this.videoData!.rootPath + '/backdrop/backdrop.jpg')}`;
  }

  setUpEpisodes() {

    this.episodes = []

    this.videoInfoList.forEach((videoInfo: VideoInfoModel) => {
      if (videoInfo.videoDetails?.season == this.selectedSeason) {
        this.episodes.push(videoInfo.videoDetails!.episode);
      }
    })

    if (this.episodes.length > 0) {
      this.selectedEpisode = this.episodes[0];
      this.watchEpisode();
    }

  }

  watchEpisode() {

    this.videoInfoList.forEach((videoInfo: VideoInfoModel) => {
      if (videoInfo.videoDetails!.season == this.selectedSeason && videoInfo.videoDetails?.episode == this.selectedEpisode) {
        this.videoData = videoInfo;
        this.selectedVideoUrl = ''
        this.isVideoPlaying = false;
        return
      }
    })
  }
}
