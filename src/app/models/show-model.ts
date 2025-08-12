import {SeasonModel} from './season-model';
import {MovieModel} from './movie-model';

export class ShowModel {
  id: number | undefined;
  name: string = '';
  rootPath: string = '';

  seasons: SeasonModel[] = []
  movies: MovieModel[] = []

}
