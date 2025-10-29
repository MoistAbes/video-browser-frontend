import { Component, OnInit } from '@angular/core';
import { ShowModel } from '../../../models/show/show-model';
import { ShowApiService } from '../../../services/api/show-api-service';
import { UtilService } from '../../../services/local/util-service';
import { MainShowCarouselComponent } from '../../../components/main-show-carousel-component/main-show-carousel-component';
import { ShowCarouselComponent } from '../../../components/show-carousel-component/show-carousel-component';

@Component({
  selector: 'app-search-page',
  imports: [MainShowCarouselComponent, ShowCarouselComponent],
  templateUrl: './home-page.html',
  standalone: true,
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit {
  hoverTimer: number | null = null;

  randomShows: ShowModel[] = [];

  showGroupedByGenre: Map<string, ShowModel[]> = new Map<string, ShowModel[]>();
  genreShowList: { genre: string; shows: ShowModel[] }[] = [];

  constructor(
    private showApiService: ShowApiService,
    public utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.findRandomShows();
    this.loadRandomShowsByStructureAndGenre();
  }

  loadRandomShowsByStructureAndGenre() {
    console.log('this is running');
    this.showApiService
      .findRandomShowsByStructureAndGroupedByGenre()
      .subscribe({
        next: (result: Map<string, ShowModel[]>) => {
          console.log('GENRE RESULT: ', result);
          this.showGroupedByGenre = result;
        },
        error: (err) => {
          console.error('Failed to load random show random shows', err);
        },
        complete: () => {
          this.mapMapToList();
          console.log('GENRE SHOW LIST: ', this.genreShowList);
        },
      });
  }

  mapMapToList() {
    this.genreShowList = Array.from(this.showGroupedByGenre.entries()).map(
      ([genre, shows]) => ({
        genre,
        shows,
      })
    );
  }

  findRandomShows() {
    this.showApiService.findRandomShows().subscribe({
      next: (value) => {
        this.randomShows = value;
      },
      error: (err) => {
        console.log('Error: ', err);
      },
      complete: () => {},
    });
  }

  // scrollLeftBtn() {
  //   this.carousel.nativeElement.scrollBy({ left: -200, behavior: 'smooth' });
  // }

  // scrollRightBtn() {
  //   this.carousel.nativeElement.scrollBy({ left: 200, behavior: 'smooth' });
  // }
}
