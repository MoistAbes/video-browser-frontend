import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatNavList} from '@angular/material/list';
import {ShowModel} from '../../../models/show/show-model';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MediaItemModel} from '../../../models/show/media-item-model';

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
export class VideoSelectorComponent {

  @Input() currentMediaItem: MediaItemModel | undefined;
  @Input() show: ShowModel | undefined;

  @Output() updateVideoData = new EventEmitter<Partial<MediaItemModel>>();
  @Output() playVideoClicked = new EventEmitter<void>();

  selectEpisode(mediaItem: MediaItemModel | undefined) {
    if (mediaItem) {
      this.updateVideoData.emit(mediaItem);
      this.playVideoClicked.emit();
    }
  }


  isCurrentlyPlaying(videoInfo: MediaItemModel | undefined): boolean {
      return this.currentMediaItem?.id == videoInfo!.id; 
  }

}
