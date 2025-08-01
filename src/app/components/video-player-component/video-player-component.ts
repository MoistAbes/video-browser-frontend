import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import videojs from 'video.js';
import {MatSlider, MatSliderThumb} from '@angular/material/slider';

type VideoJSPlayer = ReturnType<typeof videojs>;


@Component({
  selector: 'app-video-player-component',
  imports: [
    MatSlider,
    MatSliderThumb
  ],
  templateUrl: './video-player-component.html',
  styleUrl: './video-player-component.scss',
  standalone: true,
})
export class VideoPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('target', { static: true }) target!: ElementRef<HTMLVideoElement>;
  @ViewChild('progressSlider') progressSlider!: ElementRef<HTMLInputElement>;


  @Input() src: string = '';
  @Input() subtitlesUrl: string = '';

  player!: VideoJSPlayer;
  currentPlaybackSpeed: number = 1;

  overlayText: string = '';
  private overlayTimeout: any;


  currentTime: number = 0;
  duration: number = 0;
  volume: number = 1;
  isPlaying: boolean = false;

  showControls: boolean = false;

  ngOnInit() {
  }

  onSliderInput(event: Event): void {
    this.onSeekChange(event);         // Your existing logic
    this.updateSliderStyle(event);    // Visual update
  }



  onTimeUpdate(): void {
    this.currentTime = this.player.currentTime()!;

    const input = this.progressSlider?.nativeElement;
    if (input) {
      const value = (this.currentTime / Number(input.max)) * 100;
      input.style.background = `linear-gradient(to right, #e50914 ${value}%, rgba(255,255,255,0.3) ${value}%)`;
    }
  }


  updateSliderStyle(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = (+input.value / +input.max) * 100;

    input.style.background = `linear-gradient(to right, #e50914 ${value}%, rgba(255, 255, 255, 0.3) ${value}%)`;
  }

  ngAfterViewInit(): void {
    this.player = videojs(this.target.nativeElement, {
      controls: false,
      autoplay: true,
      preload: 'auto',
      textTrackSettings: false,
      fluid: true,
      sources: [{ src: this.src, type: 'video/mp4' }],
      tracks: [
        {
          kind: 'captions',
          src: this.subtitlesUrl,
          srclang: 'en',
          label: 'English',
          default: true
        }
      ]
    }, () => {
      console.log('Player is ready');

      // Add key event listener
      document.addEventListener('keydown', this.handleKeydown);

      // Update time and duration
      this.player.on('timeupdate', () => {
        this.currentTime = this.player.currentTime()!;
        this.duration = this.player.duration()!;
      });

      this.player.on('play', () => (this.isPlaying = true));
      this.player.on('pause', () => (this.isPlaying = false));

      this.volume = this.player.volume()!;
    });
  }

  togglePlay() {
    if (this.player.paused()) {
      this.player.play();
    } else {
      this.player.pause();
    }
  }

  onSeekChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const time = Number(target.value);
    this.seek(time);
  }

  seek(time: number | null) {
    if (time !== null && !isNaN(time)) {
      this.player.currentTime(time);
    }
  }

  onVolumeChange(event: Event) {
    console.log("is happening")
    const target = event.target as HTMLInputElement;
    const volume: number = Number(target.value); // convert string to number
    console.log("volume", volume);
    this.changeVolume(volume);
  }

  changeVolume(vol: number) {
    this.player.volume(Number(vol));
    this.volume = this.player.volume()!;
  }

  toggleFullscreen() {
    if (this.player.isFullscreen()) {
      this.player.exitFullscreen();
    } else {
      this.player.requestFullscreen();
    }
  }

  // Helper to format seconds as mm:ss
  formatTime(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  private showOverlay(text: string) {
    this.overlayText = text;

    if (this.overlayTimeout) {
      clearTimeout(this.overlayTimeout);
    }

    this.overlayTimeout = setTimeout(() => {
      this.overlayText = '';
    }, 1500); // message disappears after 1.5 seconds
  }

  handleKeydown = (event: KeyboardEvent): void => {
    const player = this.player;
    if (!player) return;


    switch (event.key) {
      case 'ArrowLeft':
        if (this.currentPlaybackSpeed > 0.5) {
          this.currentPlaybackSpeed = Math.round((this.currentPlaybackSpeed - 0.5) * 10) / 10;
          player.playbackRate(this.currentPlaybackSpeed);
          this.showOverlay(`Speed: ${this.currentPlaybackSpeed}x`);
        }
        break;

      case 'ArrowRight':
        if (this.currentPlaybackSpeed < 2.0) {
          this.currentPlaybackSpeed = Math.round((this.currentPlaybackSpeed + 0.5) * 10) / 10;
          player.playbackRate(this.currentPlaybackSpeed);
          this.showOverlay(`Speed: ${this.currentPlaybackSpeed}x`);
        }
        break;

      case 'ArrowUp':
        const volUp = Math.min(1, player.volume()! + 0.01);
        player.volume(volUp);
        this.volume = this.player.volume()!;
        this.showOverlay(`Volume: ${Math.round(volUp * 100)}%`);
        break;

      case 'ArrowDown':
        const volDown = Math.max(0, player.volume()! - 0.01);
        player.volume(volDown);
        this.volume = this.player.volume()!;
        this.showOverlay(`Volume: ${Math.round(volDown * 100)}%`);
        break;

    }
  };

  // Toggle play/pause when clicking on the video area
  onVideoClick() {
    if (this.player.paused()) {
      this.player.play();
      this.isPlaying = true;
    } else {
      this.player.pause();
      this.isPlaying = false;
    }
  }

  onMouseMove() {
    this.showControls = true;

    clearTimeout(this.overlayTimeout);
    this.overlayTimeout = setTimeout(() => {
      this.showControls = false;
    }, 3000); // auto-hide after 3s
  }


  onVideoDoubleClick() {
    if (this.player.isFullscreen()) {
      this.player.exitFullscreen();

    } else {
      this.player.requestFullscreen();
      this.showControls = true;

    }
  }


  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
    document.removeEventListener('keydown', this.handleKeydown);
  }

}
