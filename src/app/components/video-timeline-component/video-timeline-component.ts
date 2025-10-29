import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ChangeContext,
  NgxSliderModule,
  Options,
} from '@angular-slider/ngx-slider';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-video-timeline-component',
  imports: [NgxSliderModule, NgStyle],
  templateUrl: './video-timeline-component.html',
  standalone: true,
  styleUrl: './video-timeline-component.scss',
})
export class VideoTimelineComponent implements OnChanges {
  @Input() duration: number = 0;
  @Input() currentTime: number = 0;

  @Output() timeChange = new EventEmitter<number>();
  @Output() seekStart = new EventEmitter<void>();
  @Output() seekEnd = new EventEmitter<number>();

  isUserSeeking: boolean = false;
  hoverTime: number | null = null;
  hoverX: number = 0;

  options: Options = {
    floor: 0,
    ceil: 1,
    step: 0.1,
    showTicks: false,
    showTicksValues: false,
    showSelectionBar: true,
    animate: false,
    translate: (value: number): string => this.formatTime(value),
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['duration'] && this.duration) {
      this.options = { ...this.options, ceil: this.duration };
    }
  }

  onSeekStart(): void {
    this.isUserSeeking = true;
    this.seekStart.emit();
  }

  // tylko emitujemy event, nie ustawiamy playera
  onUserSeek({ value }: ChangeContext): void {
    this.isUserSeeking = false;
    this.seekEnd.emit(value ?? 0);
  }

  // valueChange może służyć do podglądu slidera, ale nie ruszamy playera
  onValueChange(value: number): void {
    if (this.isUserSeeking) {
      this.currentTime = value;
      this.timeChange.emit(this.currentTime);
    }
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

  //ToDO do naprawy czas hoverowany nie zgadza sie z faktycznym czasem po kliknieciu
  onSliderHover(event: MouseEvent) {
    const sliderWrapper = event.currentTarget as HTMLElement;
    const sliderEl = sliderWrapper.querySelector('.ngx-slider') as HTMLElement;
    if (!sliderEl) return;

    const rect = sliderEl.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;

 
    this.hoverTime = Math.min(
      Math.max(0, percent * this.duration),
      this.duration
    );

    // pozycja tooltipu względem wrappera
    this.hoverX = event.clientX - sliderWrapper.getBoundingClientRect().left;
  }
}
