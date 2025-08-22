import {ContentModel} from './content-model';

export class SeasonModel {
  id: number | undefined;
  number: number | undefined;
  episodes: ContentModel[] = [];

}
