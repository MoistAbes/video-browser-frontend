import {Component, OnInit} from '@angular/core';
import {
  VideoPreviewPlayerComponent
} from '../../../components/video-preview-player-component/video-preview-player-component';
import {VideoCardComponent} from '../../../components/video-card-component/video-card-component';
import {StructureTypeEnum} from '../../../enums/structure-type-enum';
import {GenreTypeEnum} from '../../../enums/genre-type-enum';
import {ShowModel} from '../../../models/show/show-model';
import {ShowApiService} from '../../../services/api/show-api-service';


@Component({
  selector: 'app-movie-page',
    imports: [
        VideoPreviewPlayerComponent,
        VideoCardComponent
    ],
  templateUrl: './movies-page.html',
  standalone: true,
  styleUrl: './movies-page.scss'
})
export class MoviesPage implements OnInit {

  showStructureType: StructureTypeEnum = StructureTypeEnum.SINGLE_MOVIE;
  showGroupedByGenre: Map<GenreTypeEnum, ShowModel[]> = new Map<GenreTypeEnum, ShowModel[]>()
  genreShowList: { genre: GenreTypeEnum; shows: ShowModel[] }[] = [];

  constructor(private showApiService: ShowApiService,) { }

  ngOnInit(): void {
    this.loadRandomShowsByStructureAndGenre()
  }

  loadRandomShowsByStructureAndGenre() {

    this.showApiService.findRandomShowsByStructureAndGroupedByGenre(this.showStructureType).subscribe({
      next: (result: Map<GenreTypeEnum, ShowModel[]>) => {
        this.showGroupedByGenre = result
      },
      error: err => {
        console.error('Failed to load random show random shows', err)
      },
      complete: () => {

      this.mapMapToList()

      }
    })

  }

  mapMapToList() {
    this.genreShowList = Array.from(this.showGroupedByGenre.entries()).map(([genre, shows]) => ({
      genre,
      shows
    }));
  }
}
