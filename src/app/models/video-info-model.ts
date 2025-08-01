import {VideoDetailsModel} from './video-details-model';
import {VideoTechnicalDetailsModel} from './videi-technical-details-model';

export class VideoInfoModel {
  id: number | undefined;
  title: string = '';
  type: string = '';
  category: string = '';
  iconFileName: string = '';
  rootPath: string = '';
  videoDetails: VideoDetailsModel | undefined;
  videoTechnicalDetails: VideoTechnicalDetailsModel | undefined;
}
