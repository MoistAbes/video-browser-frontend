import {EpisodeModel} from './episode-model';

export class SeasonModel {
  id: number | undefined;
  number: number | undefined;
  episodes: EpisodeModel[] = [];

}
