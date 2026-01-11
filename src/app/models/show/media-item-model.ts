import { MediaTypeEnum } from '../../enums/media-type-enum';
import { SubtitleModel } from './subtitle-model';

export class MediaItemModel {
  id: number = 0;
  title: string = '';
  parentTitle: string = '';
  seasonNumber: number | null = null;
  episodeNumber: number | null = null;
  type: MediaTypeEnum | undefined;
  rootPath: string = '';
  fileName: string = '';
  codec: string | null = null;
  audio: string | null = null;
  duration: number = 0;
  videoHash: string = '';
  subtitles: SubtitleModel[] = [];
}
