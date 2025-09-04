import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {interval, Subscription} from 'rxjs';
import {MatProgressBar} from '@angular/material/progress-bar';
import {VideoCardComponent} from '../../../components/video-card-component/video-card-component';
import {ShowModel} from '../../../models/show/show-model';
import {ShowApiService} from '../../../services/api/show-api-service';
import {UtilService} from '../../../services/local/util-service';
import {ShowUtilService} from '../../../services/local/show-util-service';



@Component({
  selector: 'app-search-page',
  imports: [
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
              public utilService: UtilService,
              private showUtilService: ShowUtilService,) {
  }

  ngOnInit(): void {
    this.findRandomShows();
  }

  //ToDO to nie dziala chyba trzeba bedzie ogarnac
  ngAfterViewInit() {
    // const el = this.carousel.nativeElement;
    //
    // el.addEventListener('mousedown', (e: MouseEvent) => {
    //   this.isDragging = true;
    //   el.classList.add('dragging'); // opcjonalnie do stylowania
    //   this.startX = e.pageX - el.offsetLeft;
    //   this.scrollLeft = el.scrollLeft;
    // });
    //
    // el.addEventListener('mouseleave', () => {
    //   this.isDragging = false;
    //   el.classList.remove('dragging');
    // });
    //
    // el.addEventListener('mouseup', () => {
    //   this.isDragging = false;
    //   el.classList.remove('dragging');
    // });
    //
    // el.addEventListener('mousemove', (e: MouseEvent) => {
    //   if (!this.isDragging) return;
    //   e.preventDefault();
    //   const x = e.pageX - el.offsetLeft;
    //   const walk = (x - this.startX) * 2; // *2 = szybkość scrollowania
    //   el.scrollLeft = this.scrollLeft - walk;
    // });
  }


  findRandomShows() {

    //ToDO na czas testow dodaje na sztywno nadeje

    // let show = new ShowModel();
    // show.structure = StructureTypeEnum.SINGLE_MOVIE
    // show.name = "Test Show"
    // let genre1: GenreModel = new GenreModel();
    // genre1.name = "Horror"
    // genre1.id = 1
    //
    // let genre2: GenreModel = new GenreModel();
    // genre1.name = "Thriller"
    // genre1.id = 2
    // show.genres.push(genre2);
    //
    // this.randomShows.push(show)

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

    const result: {nextShow: ShowModel | undefined, nextIndex: number} = this.showUtilService.getNextShow(this.randomShows, this.showIndex);
    this.selectedShow = result.nextShow;
    this.showIndex = result.nextIndex;

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

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.classList.add('loaded');
  }

}
