import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ChangeContext, NgxSliderModule, Options} from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-video-timeline-component',
  imports: [
    NgxSliderModule
  ],
  templateUrl: './video-timeline-component.html',
  standalone: true,
  styleUrl: './video-timeline-component.scss'
})
export class VideoTimelineComponent implements OnChanges{
  @Input() duration: number = 0;
  @Input() currentTime: number = 0;

  @Output() timeChange = new EventEmitter<number>();
  @Output() seekStart = new EventEmitter<void>();
  @Output() seekEnd = new EventEmitter<number>();

  isUserSeeking = false;

  options: Options = {
    floor: 0,
    ceil: 1,
    step: 0.1,
    showTicks: false,
    showTicksValues: false,
    showSelectionBar: true,
    animate: false,
    translate: (value: number): string => this.formatTime(value)
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['duration'] && this.duration) {
      this.options = { ...this.options, ceil: this.duration };
    }
  }

  onSeekStart(): void {
    console.log("on seek start")
    this.isUserSeeking = true;
    this.seekStart.emit();
  }

  // tylko emitujemy event, nie ustawiamy playera
  onUserSeek(changeContext: ChangeContext): void {
    console.log("onUserSeek")

    const newValue = changeContext.value ?? 0;
    this.isUserSeeking = false;
    this.seekEnd.emit(newValue); // 🔹 tylko tutaj zmieniamy czas playera
  }


  // onUserSeek(changeContext: ChangeContext): void {
  //   const newValue = changeContext.value ?? 0;
  //   console.log("onUserSeek timeline: ", newValue);
  //   console.log("onUserSeek timeline change context: ", changeContext);
  //   this.seekEnd.emit(newValue);  // 🔹 emitujemy do rodzica
  // }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  }



  // 🔹 dokładny emit wartości przy każdej zmianie suwaka
  // onValueChange(event: number): void {
  //   const newValue: number = Number(event);
  //   this.currentTime = newValue;         // lokalna aktualizacja suwaka
  //   this.timeChange.emit(newValue);      // emit do rodzica
  // }

  // valueChange może służyć do podglądu slidera, ale nie ruszamy playera
  onValueChange(value: number): void {
    console.log("onValueChange: ", this.isUserSeeking);
    if (this.isUserSeeking) {
      this.currentTime = value; // aktualizacja podglądu slidera
      console.log("onValueChange: ", this.currentTime);
      this.timeChange.emit(this.currentTime);      // emit do rodzica

    }
    // 🔹 jeśli nie szukamy, ignorujemy valueChange, żeby nie nadpisywało czasu
  }
}
