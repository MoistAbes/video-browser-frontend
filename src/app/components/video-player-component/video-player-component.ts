import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import videojs from 'video.js';
import {MatSlider, MatSliderThumb} from '@angular/material/slider';
import {VideoSelectorComponent} from './video-selector-component/video-selector-component';
import {ShowModel} from '../../models/show-model';
import {MediaItemModel} from '../../models/media-item-model';


type VideoJSPlayer = ReturnType<typeof videojs>;


@Component({
  selector: 'app-video-player-component',
  imports: [
    MatSlider,
    MatSliderThumb,
    VideoSelectorComponent,
  ],
  templateUrl: './video-player-component.html',
  styleUrl: './video-player-component.scss',
  standalone: true,
})
export class VideoPlayerComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @ViewChild('target', { static: true }) target!: ElementRef<HTMLVideoElement>;
  @ViewChild('progressSlider') progressSlider!: ElementRef<HTMLInputElement>;


  @Input() currentMediaItem: MediaItemModel | undefined;
  @Input() show: ShowModel | undefined;

  @Input() src: string = '';
  @Input() subtitlesUrl: string = '';
  @Output() playVideoClicked = new EventEmitter<void>();
  @Output() updateMediaItem = new EventEmitter<Partial<MediaItemModel>>();
  @Output() seekChange = new EventEmitter<number>();

  player!: VideoJSPlayer;
  // currentPlaybackSpeed: number = 1;

  overlayText: string = '';
  private overlayTimeout: any;

  currentTime: number = 0;
  duration: number = 0;
  volume: number = 1;
  isPlaying: boolean = false;
  isVideoListVisible: boolean = false;

  showControls: boolean = false;

  hoverTime: number = 0;
  tooltipVisible: boolean = false;
  tooltipPosition = 0; // w pikselach
  tooltipTime: string = '00:00:00';

  nextEpisodeTimerCounter: number = 16;
  isNextEpisodeNoticeVisible: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
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

      // Add key event listener
      document.addEventListener('keydown', this.handleKeydown);

      //on time update
      this.player.on('timeupdate', () => {
        this.currentTime = this.player.currentTime()!;
        this.duration = this.player.duration()!;

        const timeLeft: number = this.duration - this.currentTime;

        if (timeLeft <= 15) {
          this.isNextEpisodeNoticeVisible = true;
          // licznik w sekundach, zaokrąglony w dół
          this.nextEpisodeTimerCounter = Math.floor(timeLeft);
        } else {
          this.isNextEpisodeNoticeVisible = false;
        }
      });


      this.player.on('ended', () => {
        this.onVideoEnd();
      });

      this.player.on('play', () => (this.isPlaying = true));
      this.player.on('pause', () => (this.isPlaying = false));

      this.volume = this.player.volume()!;
    });
  }

  onSliderHover(event: MouseEvent) {
    this.hoverTime = this.calculateTimeFromEvent(event);


    this.tooltipTime = this.formatTime(this.hoverTime);

    const sliderRect = this.progressSlider.nativeElement.getBoundingClientRect();
    const relativeX = event.clientX - sliderRect.left; // pozycja kursora względem lewego krańca slidera

    // ograniczamy do szerokości slidera
    this.tooltipPosition = Math.max(0, Math.min(relativeX, sliderRect.width));

    this.tooltipVisible = true;

  }

  hideTooltip() {
    this.tooltipVisible = false;
  }

  formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const hh = h > 0 ? `${h}:` : '';
    const mm = (h > 0 && m < 10) ? `0${m}` : `${m}`;
    const ss = s < 10 ? `0${s}` : `${s}`;

    return h > 0 ? `${hh}${mm}:${ss}` : `${mm}:${ss}`;
  }

  onSeekChangeFromSlider(event: Event) {
    const time = this.hoverTime || Number((event.target as HTMLInputElement).value);

    this.seek(time);
    this.updateSliderStyle();
  }

  private calculateTimeFromEvent(event: MouseEvent): number {
    const input = this.progressSlider.nativeElement;
    const rect = input.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    return Math.round(percent * this.duration * 10) / 10; // krok 0.1
  }

  seek(time: number | null) {
    if (time !== null && !isNaN(time)) {
      this.player.currentTime(time);
    }
  }

  updateSliderStyle(): void {
    const input = this.progressSlider.nativeElement;
    const value = (this.currentTime / +input.max) * 100;

    input.style.background = `linear-gradient(to right, #e50914 ${value}%, rgba(255, 255, 255, 0.3) ${value}%)`;
  }

  // Metoda wywoływana, gdy zmienia się odcinek w selektorze
  onUpdateVideoData(videoInfo: Partial<MediaItemModel>) {
    this.currentMediaItem = { ...this.currentMediaItem, ...videoInfo } as MediaItemModel;
    this.updateMediaItem.emit(videoInfo)

    // tu możesz też uruchomić odtwarzanie itp.
  }

  onTimeUpdate(): void {


    this.currentTime = this.player.currentTime()!;

    const input = this.progressSlider?.nativeElement;
    if (input) {
      const value = (this.currentTime / Number(input.max)) * 100;
      input.style.background = `linear-gradient(to right, #e50914 ${value}%, rgba(255,255,255,0.3) ${value}%)`;
    }
  }



  onVideoEnd() {
    console.log("on video end")

    if (this.isSeason()) {
      this.handlePlayNextEpisode();
    }else if (this.isSeries()) {
      this.handlePlayNextMovie();
    }
  }

  isSeason(): boolean {
    return this.show?.seasons.length !== 0;
  }

  isSeries(): boolean {
    return this.show!.movies.length > 1
  }

  handlePlayNextMovie(): void {
    if (!this.show || !this.currentMediaItem) return;

    // Znajdź aktualny sezon
    const currentMovieIndex = this.show.movies.findIndex(
      movie => movie.mediaItem.id === this.currentMediaItem?.id
    );

    if (currentMovieIndex === -1) return;


    const nextMovie: MediaItemModel = this.show.movies[currentMovieIndex + 1].mediaItem;

    if (nextMovie) {
      this.playNextMedia(nextMovie);
      return;
    }


  }


  handlePlayNextEpisode(): void {
    if (!this.show || !this.currentMediaItem) return;

    const currentSeasonNumber = this.currentMediaItem.seasonNumber ?? 1;
    const currentEpisodeNumber = this.currentMediaItem.episodeNumber ?? 1;

    // Znajdź aktualny sezon
    const currentSeasonIndex = this.show.seasons.findIndex(
      season => season.number === currentSeasonNumber
    );
    if (currentSeasonIndex === -1) return;

    const currentSeason = this.show.seasons[currentSeasonIndex];

    // Znajdź indeks obecnego odcinka w sezonie
    const currentEpisodeIndex = currentSeason.episodes.findIndex(
      ep => ep.mediaItem.episodeNumber === currentEpisodeNumber
    );

    // 1. Próba pobrania następnego odcinka w tym samym sezonie
    const nextEpisode = currentSeason.episodes[currentEpisodeIndex + 1];
    if (nextEpisode) {
      this.playNextMedia(nextEpisode.mediaItem);
      return;
    }

    // 2. Próba pobrania pierwszego odcinka następnego sezonu
    const nextSeason = this.show.seasons[currentSeasonIndex + 1];
    if (nextSeason && nextSeason.episodes.length > 0) {
      this.playNextMedia(nextSeason.episodes[0].mediaItem);
      return;
    }

    // 3. Koniec listy
    console.log('Brak następnego odcinka ani sezonu – autoplay zakończony');
  }

// wydzielona metoda, aby uniknąć duplikacji
  private playNextMedia(mediaItem: MediaItemModel): void {
    this.currentMediaItem = mediaItem;
    this.updateMediaItem.emit(mediaItem);
    this.playVideoClicked.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src'] && !changes['src'].firstChange && this.player) {
      console.log('Video source changed:', this.src);
      this.player.src({ src: this.src, type: 'video/mp4' });
    }

    if (changes['subtitlesUrl'] && !changes['subtitlesUrl'].firstChange && this.player) {
      console.log('Subtitles changed:', this.subtitlesUrl);

      // Usuń stare napisy
      const tracks = this.player.remoteTextTracks() as any; // rzutujemy na any

      for (let i = tracks.length - 1; i >= 0; i--) {
        const track = tracks[i]; // możemy traktować jak tablicę
        this.player.removeRemoteTextTrack(track);
      }


      // Dodaj nowe napisy
      this.player.addRemoteTextTrack({
        kind: 'captions',
        src: this.subtitlesUrl,
        srclang: 'en',
        label: 'English',
        default: true
      }, false);
    }
  }

  togglePlay() {
    if (this.player.paused()) {
      this.player.play();
    } else {
      this.player.pause();
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
    const container = document.querySelector('.video-player-container') as HTMLElement;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
      this.showControls = true;
    }
  }


  onVideoDoubleClick() {

    const container = document.querySelector('.video-player-container') as HTMLElement;
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

  formatLabel(value: number): string {
    return `${Math.round(value * 100)}%`; // zawsze całkowite %
  }


  handleKeydown = (event: KeyboardEvent): void => {
    const player = this.player;
    if (!player) return;


    switch (event.key) {

      case 'ArrowLeft':
      case 'a': // alternatywnie klawisz 'A'
      case 'A':
        player.currentTime(Math.max(0, player.currentTime()! - 5));
        // this.showOverlay(`⏪ -5s`);
        break;

      case 'ArrowRight':
      case 'd': // alternatywnie klawisz 'D'
      case 'D':
        player.currentTime(Math.min(player.duration()!, player.currentTime()! + 5));
        // this.showOverlay(`⏩ +5s`);
        break;


      // case 'ArrowLeft':
      //   if (this.currentPlaybackSpeed > 0.5) {
      //     this.currentPlaybackSpeed = Math.round((this.currentPlaybackSpeed - 0.5) * 10) / 10;
      //     player.playbackRate(this.currentPlaybackSpeed);
      //     this.showOverlay(`Speed: ${this.currentPlaybackSpeed}x`);
      //   }
      //   break;
      //
      // case 'ArrowRight':
      //   if (this.currentPlaybackSpeed < 2.0) {
      //     this.currentPlaybackSpeed = Math.round((this.currentPlaybackSpeed + 0.5) * 10) / 10;
      //     player.playbackRate(this.currentPlaybackSpeed);
      //     this.showOverlay(`Speed: ${this.currentPlaybackSpeed}x`);
      //   }
      //   break;

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
      this.isVideoListVisible = false
    }, 3000); // auto-hide after 3s
  }




  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
    document.removeEventListener('keydown', this.handleKeydown);
  }

}
