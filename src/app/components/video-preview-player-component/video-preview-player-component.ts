import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import videojs from 'video.js';

type VideoJSPlayer = ReturnType<typeof videojs>;

@Component({
  selector: 'app-video-preview-player-component',
  imports: [],
  templateUrl: './video-preview-player-component.html',
  standalone: true,
  styleUrl: './video-preview-player-component.scss',
})
export class VideoPreviewPlayerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('targetPlayer', { static: true }) targetPlayer!: ElementRef;
  player!: VideoJSPlayer;

  @Input() videoSrc!: string;

  ngAfterViewInit(): void {
    this.player = videojs(this.targetPlayer.nativeElement, {
      controls: false,
      autoplay: true,
      muted: false,
      loop: true,
      responsive: true,
      fluid: true,
    });
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }
}
