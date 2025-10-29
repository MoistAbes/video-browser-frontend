import { Component, Input } from '@angular/core';
import { ShowModel } from '../../models/show/show-model';
import { UtilService } from '../../services/local/util-service';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { ShowUtilService } from '../../services/local/show-util-service';
import { Subscription } from 'rxjs/internal/Subscription';
import { interval } from 'rxjs/internal/observable/interval';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ShowCarouselComponent } from '../show-carousel-component/show-carousel-component';

@Component({
  selector: 'app-main-show-carousel-component',
  imports: [NgOptimizedImage, MatProgressBar, ShowCarouselComponent],
  templateUrl: './main-show-carousel-component.html',
  styleUrl: './main-show-carousel-component.scss',
})
export class MainShowCarouselComponent {
  @Input() shows: ShowModel[] = [];

  selectedShow: ShowModel | undefined;
  private showIndex: number = 0; // przeniosłem index jako pole klasy
  isTimerRunning: boolean = true;
  progressValue: number = 0; // wartość dla progress bara (0–100)

  private timerSubscription?: Subscription;

  constructor(
    public utilService: UtilService,
    private router: Router,
    private showUtilService: ShowUtilService
  ) {}

  ngOnInit(): void {
    this.selectedShow = this.shows[0];
    this.startTimer();

  }

  moveToMovieDetails(title: string) {
    this.router.navigate(['/movie-details', title]).catch((error) => {
      console.error('❌ Błąd podczas nawigacji:', error);
    });
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.classList.add('loaded');
  }

  onNextButtonClick() {
    this.nextShow();

    // dodatkowo resetujemy timer
    if (this.isTimerRunning) {
      this.startTimer();
    }
  }

  nextShow() {
    const result: { nextShow: ShowModel | undefined; nextIndex: number } =
      this.showUtilService.getNextShow(this.shows, this.showIndex);
    this.selectedShow = result.nextShow;
    this.showIndex = result.nextIndex;
  }

  private startTimer() {
    this.stopTimer();

    const duration: number = 10000; // 10s
    const step: number = 100; // co ile ms aktualizujemy progress bar
    let elapsed: number = 0;

    this.timerSubscription = interval(step).subscribe(() => {
      elapsed += step;
      this.progressValue = (elapsed / duration) * 100;

      if (elapsed >= duration) {
        this.nextShow(); // <-- używamy metody
        elapsed = 0;
      }
    });

    this.isTimerRunning = true;
  }

  private stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
    }
    this.isTimerRunning = false;
  }

  toggleTimer() {
    if (this.isTimerRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  ngOnDestroy() {
    // zatrzymanie timera przy opuszczeniu komponentu
    this.stopTimer();
  }
}
