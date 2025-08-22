import {MediaItemModel} from './media-item-model';

export class ContentModel {
  id: number = 0;
  type: string = "";
  mediaItem: MediaItemModel = new MediaItemModel();
}
