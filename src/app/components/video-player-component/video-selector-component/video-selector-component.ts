import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatNavList} from '@angular/material/list';
import {ShowModel} from '../../../models/show-model';
import {MatTab, MatTabGroup} from '@angular/material/tabs';

@Component({
  selector: 'app-video-selector-component',
  imports: [
    MatNavList,
    MatTabGroup,
    MatTab,
  ],
  templateUrl: './video-selector-component.html',
  standalone: true,
  styleUrl: './video-selector-component.scss'
})
export class VideoSelectorComponent implements OnInit {


  // @Input() currentVideoInfo: VideoInfoModel | undefined;
  @Input() show: ShowModel | undefined;

  // @Output() updateVideoData = new EventEmitter<Partial<VideoInfoModel>>();
  @Output() playVideoClicked = new EventEmitter<void>();

  ngOnInit(): void {
    console.log("Show: ", this.show)
    // console.log("curernt video: ", this.currentVideoInfo);
  }

  // selectEpisode(videoInfo: VideoInfoModel | undefined) {
  //   if (videoInfo) {
  //     this.updateVideoData.emit(videoInfo);
  //     this.playVideoClicked.emit();
  //     console.log("play video: ", videoInfo);
  //   }
  // }


  // isCurrentlyPlaying(videoInfo: VideoInfoModel | undefined): boolean {
  //     return this.currentVideoInfo?.id == videoInfo!.id; // zakładam że VideoInfoModel ma ID
  // }

}
