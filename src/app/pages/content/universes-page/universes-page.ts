import { Component, OnInit } from '@angular/core';
import { StructureTypeEnum } from '../../../enums/structure-type-enum';
import { GenreTypeEnum } from '../../../enums/genre-type-enum';
import { ShowModel } from '../../../models/show/show-model';
import { ShowApiService } from '../../../services/api/show-api-service';
import { ShowCarouselComponent } from '../../../components/show-carousel-component/show-carousel-component';
import { MainShowCarouselComponent } from '../../../components/main-show-carousel-component/main-show-carousel-component';

@Component({
  selector: 'app-universes-page',
  imports: [ShowCarouselComponent, MainShowCarouselComponent],
  templateUrl: './universes-page.html',
  standalone: true,
  styleUrl: './universes-page.scss',
})
export class UniversesPage implements OnInit {
  featuredShows: ShowModel[] = [];

  showStructureType: StructureTypeEnum = StructureTypeEnum.HYBRID;
  showGroupedByGenre: Map<string, ShowModel[]> = new Map<string, ShowModel[]>();
  genreShowList: { genre: string; shows: ShowModel[] }[] = [];

  constructor(private showApiService: ShowApiService) {}

  ngOnInit(): void {
    this.findRandomByStructure();

    this.loadRandomShowsByStructureAndGenre();
  }

  findRandomByStructure() {
    this.showApiService
      .findRandomShowsByStructure(this.showStructureType)
      .subscribe({
        next: (result) => {
          console.log('featured shows: ', result);
          this.featuredShows = result;
        },
        error: (err) => {
          console.error('Failed to load featured shows', err);
        },
      });
  }

  loadRandomShowsByStructureAndGenre() {
    this.showApiService
      .findRandomShowsByStructureAndGroupedByGenre(this.showStructureType)
      .subscribe({
        next: (result: Map<string, ShowModel[]>) => {
          this.showGroupedByGenre = result;
        },
        error: (err) => {
          console.error('Failed to load random show random shows', err);
        },
        complete: () => {
          this.mapMapToList();
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
}
