import {SeasonModel} from './season-model';
import {ContentModel} from './content-model';
import {StructureTypeEnum} from '../enums/structure-type-enum';
import {GenreTypeEnum} from '../enums/genre-type-enum';

export class ShowModel {
  id: number | undefined;
  name: string = '';
  rootPath: string = '';

  seasons: SeasonModel[] = []
  movies: ContentModel[] = []

  // structure: string = ''
  // genres: string[] = []


  structure: StructureTypeEnum = StructureTypeEnum.UNKNOWN;
  genres: GenreTypeEnum[] = [];


}
