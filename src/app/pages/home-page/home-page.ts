import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ShowApiService} from '../../services/api/show-api-service';
import {ShowModel} from '../../models/show-model';
import {MainIconPathPipe} from '../../pipes/main-icon-path-pipe';
import {VideoCardComponent} from '../../components/video-card-component/video-card-component';
import {Router} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {Endpoints} from '../../endpoints/endpoints';
import {interval, Subscription} from 'rxjs';
import {MatProgressBar} from '@angular/material/progress-bar';
import {UtilService} from '../../services/local/util-service';

@Component({
  selector: 'app-search-page',
  imports: [
    MainIconPathPipe,
    VideoCardComponent,
    NgOptimizedImage,
    MatProgressBar
  ],
  templateUrl: './home-page.html',
  standalone: true,
  styleUrl: './home-page.scss'
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy{
  hoverTimer: number | null = null;

  selectedShow: ShowModel | undefined;
  randomShows: ShowModel[] = [];
  private timerSubscription?: Subscription;
  progressValue: number = 0; // wartość dla progress bara (0–100)
  isTimerRunning: boolean = true;
  private showIndex: number = 0; // przeniosłem index jako pole klasy

  @ViewChild('carousel', { static: false }) carousel!: ElementRef;
  isDragging: boolean = false;
  startX: number = 0;
  scrollLeft: number = 0;

  constructor(private showApiService: ShowApiService,
              private router: Router,
              public utilService: UtilService,) {
  }

  ngOnInit(): void {
    this.findRandomShows();
  }

  //ToDO to nie dziala chyba trzeba bedzie ogarnac
  ngAfterViewInit() {
    const el = this.carousel.nativeElement;

    el.addEventListener('mousedown', (e: MouseEvent) => {
      this.isDragging = true;
      el.classList.add('dragging'); // opcjonalnie do stylowania
      this.startX = e.pageX - el.offsetLeft;
      this.scrollLeft = el.scrollLeft;
    });

    el.addEventListener('mouseleave', () => {
      this.isDragging = false;
      el.classList.remove('dragging');
    });

    el.addEventListener('mouseup', () => {
      this.isDragging = false;
      el.classList.remove('dragging');
    });

    el.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this.isDragging) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - this.startX) * 2; // *2 = szybkość scrollowania
      el.scrollLeft = this.scrollLeft - walk;
    });
  }


  findRandomShows() {
    this.showApiService.findRandomShows().subscribe({
      next: value => {
        this.randomShows = value;
        this.selectedShow = this.randomShows[0];
        this.startTimer()
      },
      error: (err) => {
        console.log("Error: ", err)
      },
      complete: () => {}
    })
  }

  scrollLeftBtn() {
    this.carousel.nativeElement.scrollBy({ left: -200, behavior: 'smooth' });
  }

  scrollRightBtn() {
    this.carousel.nativeElement.scrollBy({ left: 200, behavior: 'smooth' });
  }

  moveToMovieDetails(title: string) {
    this.router.navigate(['/movie-details', title])
      .catch(error => {
        console.error('❌ Błąd podczas nawigacji:', error);
      });
  }

  //ToDO to jest na kiedys do dodatkowego info na hover
  startHoverTimer(videoInfo: any) {
    this.hoverTimer = setTimeout(() => {
      this.onHoverOneSecond(videoInfo);
    }, 1000); // 1000 ms = 1 second
  }

  cancelHoverTimer() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }

  onHoverOneSecond(videoInfo: any) {
    console.log('Hovered for 1 second over:', videoInfo);
    // put your delayed hover action here
  }

  // getBackdropUrl(): string {
  //   return `${Endpoints.videos.icon}?path=${encodeURIComponent(this.selectedShow!.rootPath + '/backdrop/backdrop.jpg')}`;
  // }

  private startTimer() {
    this.stopTimer();

    const duration: number = 10000; // 10s
    const step: number = 100;       // co ile ms aktualizujemy progress bar
    let elapsed: number = 0;

    this.timerSubscription = interval(step).subscribe(() => {
      elapsed += step;
      this.progressValue = (elapsed / duration) * 100;

      if (elapsed >= duration) {
        this.nextShow();   // <-- używamy metody
        elapsed = 0;
      }
    });

    this.isTimerRunning = true;
  }

  nextShow() {
    if (this.randomShows.length > 0) {
      this.showIndex = (this.showIndex + 1) % this.randomShows.length;
      this.selectedShow = this.randomShows[this.showIndex];
      this.progressValue = 0; // reset progress bara
    }
  }

  onNextButtonClick() {
    this.nextShow();

    // dodatkowo resetujemy timer
    if (this.isTimerRunning) {
      this.startTimer();
    }
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
