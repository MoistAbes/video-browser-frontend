import {SeasonModel} from './season-model';
import {StructureTypeEnum} from '../../enums/structure-type-enum';
import {MediaItemModel} from './media-item-model';
import {GenreModel} from './genre-model';

export class ShowModel {
  id: number | undefined;
  name: string = '';
  rootPath: string = '';

  seasons: SeasonModel[] = []
  movies: MediaItemModel[] = []

  structure: StructureTypeEnum = StructureTypeEnum.UNKNOWN;
  genres: GenreModel[] = []

}
