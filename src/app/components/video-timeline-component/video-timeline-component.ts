import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ChangeContext,
  NgxSliderModule,
  Options,
  SliderComponent,
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

  @ViewChild('sliderElement', { read: ElementRef })
  sliderEl!: ElementRef<HTMLElement>;

  @ViewChild(SliderComponent)
  sliderCmp!: SliderComponent;

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

  onValueChange(value: number, isHover = false): void {
    if (isHover) {
      // tylko tooltip
      this.hoverTime = value;
      return;
    }

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

  onSliderHover(event: MouseEvent) {
    if (!this.sliderEl || !this.sliderCmp) return;

    const cmp: any = this.sliderCmp;
    const rect = this.sliderEl.nativeElement.getBoundingClientRect();

    // pozycja kursora względem slidera
    let relativeX = event.clientX - rect.left;

    const handleHalf = cmp.handleHalfDimension;
    const fullWidth = cmp.fullBarElement._dimension;

    // ograniczamy hoverX w obrębie slidera (uchwyt nie wychodzi poza)
    relativeX = Math.max(handleHalf, Math.min(relativeX, fullWidth - handleHalf));
    this.hoverX = relativeX;

    // procent w ruchomym obszarze slidera
    const percent = (relativeX - handleHalf) / (fullWidth - 2 * handleHalf);

    const floor = cmp.options.floor ?? 0;
    const ceil = cmp.options.ceil ?? 100;
    const step = cmp.options.step ?? 1;

    let rawValue = floor + percent * (ceil - floor);
    const steppedValue = Math.round(rawValue / step) * step;

    // wywołujemy onValueChange dla hovera, żeby logika value była identyczna
    this.onValueChange(steppedValue, true);
  }
}
