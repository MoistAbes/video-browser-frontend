import {Component, HostBinding, Input} from '@angular/core';
import {NgStyle} from '@angular/common';
import {VideoPreviewPlayerComponent} from '../../video-preview-player-component/video-preview-player-component';

@Component({
  selector: 'app-video-card-info-panel-component',
  imports: [
    NgStyle,
    VideoPreviewPlayerComponent
  ],
  templateUrl: './video-card-info-panel-component.html',
  standalone: true,
  styleUrl: './video-card-info-panel-component.scss'
})
export class VideoCardInfoPanelComponent {

  @Input() title!: string;
  @Input() description!: string;
  @Input() top!: number;
  @Input() left!: number;

}
