import {MediaTypeEnum} from '../enums/media-type-enum';

export class MediaItemModel {
  constructor(
    public id: number,
    public title: string,
    public parentTitle: string,
    public seasonNumber: number | null,
    public episodeNumber: number | null,
    public type: MediaTypeEnum,
    public rootPath: string,
    public fileName: string,
    public codec: string | null,
    public audio: string | null,
    public videoHash: string
  ) {}



  get isEpisode(): boolean {
    return this.type === MediaTypeEnum.EPISODE;
  }
}
