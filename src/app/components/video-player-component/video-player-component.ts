import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import videojs from 'video.js';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { VideoSelectorComponent } from './video-selector-component/video-selector-component';
import { ShowModel } from '../../models/show/show-model';
import { MediaItemModel } from '../../models/show/media-item-model';
import { ShowUtilService } from '../../services/local/show-util-service';
import { VideoTimelineComponent } from '../video-timeline-component/video-timeline-component';
import { StructureTypeEnum } from '../../enums/structure-type-enum';

type VideoJSPlayer = ReturnType<typeof videojs>;

@Component({
  selector: 'app-video-player-component',
  imports: [
    MatSlider,
    MatSliderThumb,
    VideoSelectorComponent,
    VideoTimelineComponent,
  ],
  templateUrl: './video-player-component.html',
  styleUrl: './video-player-component.scss',
  standalone: true,
})
export class VideoPlayerComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  @ViewChild('target', { static: true }) target!: ElementRef<HTMLVideoElement>;

  @Input() currentMediaItem: MediaItemModel | undefined;
  @Input() show: ShowModel | undefined;

  @Input() src: string = '';
  @Input() subtitlesUrl: string = '';
  @Output() playVideoClicked = new EventEmitter<void>();
  @Output() updateMediaItem = new EventEmitter<Partial<MediaItemModel>>();
  @Output() seekChange = new EventEmitter<number>();

  player!: VideoJSPlayer;

  overlayText: string = '';
  private overlayTimeout: any;

  currentTime: number = 0;
  duration: number = 0;
  volume: number = 1;
  isPlaying: boolean = false;
  isVideoListVisible: boolean = false;
  wasPlaying: boolean = true;
  isSeeking = false;

  showControls: boolean = false;

  nextEpisodeTimerCounter: number = 16;
  isNextEpisodeNoticeVisible: boolean = false;

  private mouseMoveTimeout: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private showUtilService: ShowUtilService
  ) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.player = videojs(
      this.target.nativeElement,
      {
        controls: false,
        autoplay: true,
        preload: 'auto',
        textTrackSettings: false,
        fluid: true,
        userActions: {
          hotkeys: false, // 👈 wyłącza wbudowane hotkeye
        },
        sources: [{ src: this.src, type: 'video/mp4' }],
        tracks: [
          {
            kind: 'captions',
            src: this.subtitlesUrl,
            srclang: 'en',
            label: 'English',
            default: true,
          },
        ],
      },
      () => {
        const container = document.querySelector(
          '.video-player-container'
        ) as HTMLElement;

        const hideCursor = () => container.classList.add('hide-cursor');
        const showCursor = () => container.classList.remove('hide-cursor');

        const resetMouseTimer = () => {
          showCursor();
          clearTimeout(this.mouseMoveTimeout);
          this.mouseMoveTimeout = setTimeout(() => {
            // Ukryj tylko, jeśli jesteśmy w fullscreenie
            if (document.fullscreenElement === container) hideCursor();
          }, 3000);
        };

        container.addEventListener('mousemove', resetMouseTimer);
        container.addEventListener('mouseleave', hideCursor);

        // Wyczyszczenie po zniszczeniu
        this.player.on('dispose', () => {
          container.removeEventListener('mousemove', resetMouseTimer);
          container.removeEventListener('mouseleave', hideCursor);
          clearTimeout(this.mouseMoveTimeout);
        });

        // Add key event listener
        document.addEventListener('keydown', this.handleKeydown);

        //on time update
        this.player.on('timeupdate', () => {
          if (!this.isSeeking) {
            this.currentTime = this.player.currentTime()!;
            this.duration = this.player.duration()!;

            const timeLeft: number = this.duration - this.currentTime;

            if (
              timeLeft <= 15 &&
              this.show?.structure != StructureTypeEnum.SINGLE_MOVIE
            ) {
              this.isNextEpisodeNoticeVisible = true;
              // licznik w sekundach, zaokrąglony w dół
              this.nextEpisodeTimerCounter = Math.floor(timeLeft);
            } else {
              this.isNextEpisodeNoticeVisible = false;
            }
          }
        });

        this.player.on('ended', () => {
          this.onVideoEnd();
        });

        this.player.on('play', () => (this.isPlaying = true));
        this.player.on('pause', () => (this.isPlaying = false));

        this.volume = this.player.volume()!;
      }
    );
  }

  formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const hh = h > 0 ? `${h}:` : '';
    const mm = h > 0 && m < 10 ? `0${m}` : `${m}`;
    const ss = s < 10 ? `0${s}` : `${s}`;

    return h > 0 ? `${hh}${mm}:${ss}` : `${mm}:${ss}`;
  }

  onSeekChangeFromSlider(newTime: number) {
    this.player.currentTime(newTime);
    this.currentTime = newTime; // zsynchronizuj zmienną w Angularze
  }

  // Aktualizacja slidera tylko wtedy, gdy player wysyła timeupdate
  onTimeUpdateFromPlayer(time: number) {
    if (this.isSeeking) {
      this.currentTime = time;
      this.player.currentTime(this.currentTime);
    }
  }

  onSeekStart() {
    this.isSeeking = true; // blokujemy update z playera
    if (!this.player.paused()) {
      this.wasPlaying = true;
      this.player.pause();
    } else {
      this.wasPlaying = false;
    }
  }

  onSeekEnd(newTime: number) {
    this.player.currentTime(newTime);
    this.isSeeking = false;

    if (this.wasPlaying) {
      this.player?.play()!.catch((err) => {});
    }
  }

  // Metoda wywoływana, gdy zmienia się odcinek w selektorze
  onUpdateVideoData(videoInfo: Partial<MediaItemModel>) {
    this.currentMediaItem = {
      ...this.currentMediaItem,
      ...videoInfo,
    } as MediaItemModel;
    this.updateMediaItem.emit(videoInfo);
  }

  onTimeUpdate(): void {
    this.currentTime = this.player.currentTime()!;

    // const input = this.progressSlider?.nativeElement;
    // if (input) {
    //   const value = (this.currentTime / Number(input.max)) * 100;
    //   input.style.background = `linear-gradient(to right, #e50914 ${value}%, rgba(255,255,255,0.3) ${value}%)`;
    // }
  }

  onVideoEnd() {
    const nextMediaItem: MediaItemModel | undefined =
      this.showUtilService.findNextMediaItemAutoplay(
        this.show,
        this.currentMediaItem
      );

    if (nextMediaItem) {
      this.playNextMedia(nextMediaItem);
    }
  }

  private playNextMedia(mediaItem: MediaItemModel): void {
    this.currentMediaItem = mediaItem;
    this.updateMediaItem.emit(mediaItem);
    this.playVideoClicked.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src'] && !changes['src'].firstChange && this.player) {
      this.player.src({ src: this.src, type: 'video/mp4' });
    }

    if (
      changes['subtitlesUrl'] &&
      !changes['subtitlesUrl'].firstChange &&
      this.player
    ) {
      // Usuń stare napisy
      const tracks = this.player.remoteTextTracks() as any; // rzutujemy na any

      for (let i = tracks.length - 1; i >= 0; i--) {
        const track = tracks[i]; // możemy traktować jak tablicę
        this.player.removeRemoteTextTrack(track);
      }

      // Dodaj nowe napisy
      this.player.addRemoteTextTrack(
        {
          kind: 'captions',
          src: this.subtitlesUrl,
          srclang: 'en',
          label: 'English',
          default: true,
        },
        false
      );
    }
  }

  onVolumeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const volume: number = Number(target.value); // convert string to number
    this.changeVolume(volume);
  }

  changeVolume(vol: number) {
    this.player.volume(Number(vol));
    this.volume = this.player.volume()!;
  }

  toggleFullscreen() {
    const container = document.querySelector(
      '.video-player-container'
    ) as HTMLElement;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
      this.showControls = true;
    }
  }

  onVideoDoubleClick() {
    const container = document.querySelector(
      '.video-player-container'
    ) as HTMLElement;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
      this.showControls = true;
    }
  }

  private showOverlay(text: string) {
    this.overlayText = text;

    if (this.overlayTimeout) {
      clearTimeout(this.overlayTimeout);
    }

    this.overlayTimeout = setTimeout(() => {
      this.overlayText = '';
      this.cdr.detectChanges();
    }, 1500);
  }

  handleKeydown = (event: KeyboardEvent): void => {
    const player = this.player;
    if (!player) return;

    switch (event.key) {
      case 'ArrowLeft':
      case 'a': // alternatywnie klawisz 'A'
      case 'A':
        player.currentTime(Math.max(0, player.currentTime()! - 5));
        this.currentTime = player.currentTime()!;
        // this.showOverlay(`⏪ -5s`);
        break;

      case 'ArrowRight':
      case 'd': // alternatywnie klawisz 'D'
      case 'D':
        player.currentTime(
          Math.min(player.duration()!, player.currentTime()! + 5)
        );
        this.currentTime = player.currentTime()!;

        // this.showOverlay(`⏩ +5s`);
        break;

      case ' ':
      case 'Spacebar': // starsze przeglądarki
        this.togglePlay();
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
  // onVideoClick() {
  //   if (this.player.paused()) {
  //     this.player.play();
  //     this.isPlaying = true;
  //   } else {
  //     this.player.pause();
  //     this.isPlaying = false;
  //   }
  // }

  togglePlay() {
    if (this.player.paused()) {
      this.player.play();
    } else {
      this.player.pause();
    }
  }

  onMouseMove() {
    this.showControls = true;

    clearTimeout(this.overlayTimeout);
    this.overlayTimeout = setTimeout(() => {
      this.showControls = false;
      this.isVideoListVisible = false;
    }, 3000); // auto-hide after 3s
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
    document.removeEventListener('keydown', this.handleKeydown);
  }
}
