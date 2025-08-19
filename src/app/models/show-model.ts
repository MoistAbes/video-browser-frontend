import {SeasonModel} from './season-model';
import {ContentModel} from './content-model';

export class ShowModel {
  id: number | undefined;
  name: string = '';
  rootPath: string = '';

  seasons: SeasonModel[] = []
  movies: ContentModel[] = []

  category: string = ''
  genres: string[] = []

}
