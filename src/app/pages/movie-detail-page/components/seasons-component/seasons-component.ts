import {Component, Input, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output, OnInit} from '@angular/core';
import {Endpoints} from '../../../../endpoints/endpoints';
import {VideoPlayerComponent} from '../../../../components/video-player-component/video-player-component';
import {NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ShowModel} from '../../../../models/show-model';
import {EpisodeModel} from '../../../../models/episode-model';

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
  // @Input() currentVideoInfo: VideoInfoModel | undefined;
  @Input() selectedVideoUrl: string = '';
  @Input() selectedSeason: number | undefined

  // @Output() updateVideoData = new EventEmitter<Partial<VideoInfoModel>>();
  @Output() playVideoClicked = new EventEmitter<void>();

  episodes: EpisodeModel[] = [];
  selectedEpisode: EpisodeModel | undefined


  ngOnInit(): void {
    this.selectedSeason = this.show?.seasons[0].number;
    this.setUpEpisodes();
  }

  // getBackdropUrl(): string {
  //   return `${Endpoints.videos.icon}?path=${encodeURIComponent(this.currentVideoInfo!.rootPath + '/backdrop/backdrop.jpg')}`;
  // }

  setUpEpisodes() {
    console.log("Setup episodes");

    this.episodes = this.show?.seasons
      .filter(season => season.number == this.selectedSeason)
      .flatMap(season => season.episodes) || [];

    if (this.episodes.length > 0) {
      this.selectedEpisode = this.episodes[0];
      // this.updateVideoData.emit(this.selectedEpisode.videoInfo);
    }
  }


  onEpisodeSelect() {
    // this.updateVideoData.emit(this.selectedEpisode!.videoInfo);
  }
}
