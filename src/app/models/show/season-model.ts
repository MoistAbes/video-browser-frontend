import {MediaItemModel} from './media-item-model';

export class SeasonModel {
  id: number | undefined;
  number: number | undefined;
  episodes: MediaItemModel[] = [];

}
