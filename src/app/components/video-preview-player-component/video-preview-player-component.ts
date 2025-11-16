import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
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
export class VideoPreviewPlayerComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('targetPlayer', { static: true }) targetPlayer!: ElementRef;
  player!: VideoJSPlayer;

  @Input() videoSrc!: string;

  ngAfterViewInit(): void {
    this.player = videojs(this.targetPlayer.nativeElement, {
      controls: false,
      autoplay: false, // nie próbujemy od razu
      // muted: true, // muted pozwala autoplay
      preload: 'auto',
      loop: true,
      responsive: true,
      fluid: true,
    });

    this.player.on('loadedmetadata', () => {
      const playPromise = this.player?.play();
      if (playPromise) {
        playPromise.catch((err) => console.warn('Video play error:', err));
      }
    });

    // jeśli videoSrc już jest w momencie init
    if (this.videoSrc) {
      this.setVideoSrc(this.videoSrc);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videoSrc'] && this.videoSrc) {
      // ustawiamy dopiero jak mamy URL z ważnym authKey
      this.player.src({ src: this.videoSrc, type: 'video/mp4' });
      this.player.load();

      // spróbuj autoplay tylko jeśli wideo jest wyciszone
      if (this.player.muted()) {
        const playPromise = this.player.play();
        if (playPromise) playPromise.catch((err) => console.warn('Video play error:', err));
      }
    }
  }

  private setVideoSrc(src: string): void {
    if (this.player) {
      this.player.src({ src, type: 'video/mp4' });
      this.player.load();
      const playPromise = this.player.play();
      if (playPromise) {
        playPromise.catch((err) => console.warn('Video play error:', err));
      }
    }
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }
}
