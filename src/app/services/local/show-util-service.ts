import {Injectable} from '@angular/core';
import {ShowModel} from '../../models/show/show-model';
import {MediaItemModel} from '../../models/show/media-item-model';
import {StructureTypeEnum} from '../../enums/structure-type-enum';
import {SeasonModel} from '../../models/show/season-model';
import {ContentModel} from '../../models/show/content-model';

@Injectable({
  providedIn: 'root'
})
export class ShowUtilService {

  constructor() { }

  getEpisodesForSeason(show: ShowModel | undefined, seasonNumber: number | null): MediaItemModel[] {

    if (!show || !seasonNumber) return [];

    return show.seasons
      .filter(season => season.number === seasonNumber)
      .flatMap(season => season.episodes)
      .flatMap(episode => episode.mediaItem);
  }

  getNextShow(shows: ShowModel[], currentIndex: number): { nextShow: ShowModel | undefined, nextIndex: number } {
    if (shows.length === 0) return { nextShow: undefined, nextIndex: currentIndex };

    const nextIndex: number = (currentIndex + 1) % shows.length;
    return {
      nextShow: shows[nextIndex],
      nextIndex
    };
  }


  findNextMediaItemAutoplay(show: ShowModel | undefined, currentMediaitem: MediaItemModel | undefined): MediaItemModel | undefined {

    if (!show || !currentMediaitem) return;

    if (show.structure == StructureTypeEnum.SEASONAL_SERIES) {
      return this.handlePlayNextEpisode(show, currentMediaitem);

    }else if (show.structure == StructureTypeEnum.MOVIE_COLLECTION) {
      return this.handlePlayNextMovie(show, currentMediaitem);
    }

    return undefined;

  }


  private handlePlayNextEpisode(show: ShowModel | undefined, currentMediaItem: MediaItemModel | undefined): MediaItemModel | undefined {
    if (!show || !currentMediaItem) return;

    const currentSeasonNumber: number = currentMediaItem.seasonNumber ?? 1;
    const currentEpisodeNumber: number = currentMediaItem.episodeNumber ?? 1;

    // Znajdź aktualny sezon
    const currentSeasonIndex: number = show.seasons.findIndex(
      season => season.number === currentSeasonNumber
    );
    if (currentSeasonIndex === -1) return;

    const currentSeason: SeasonModel = show.seasons[currentSeasonIndex];

    // Znajdź indeks obecnego odcinka w sezonie
    const currentEpisodeIndex: number = currentSeason.episodes.findIndex(
      ep => ep.mediaItem.episodeNumber === currentEpisodeNumber
    );

    // 1. Próba pobrania następnego odcinka w tym samym sezonie
    const nextEpisode: ContentModel = currentSeason.episodes[currentEpisodeIndex + 1];
    if (nextEpisode) {
      return nextEpisode.mediaItem;
    }

    // 2. Próba pobrania pierwszego odcinka następnego sezonu
    const nextSeason: SeasonModel = show.seasons[currentSeasonIndex + 1];
    if (nextSeason && nextSeason.episodes.length > 0) {
      return nextSeason.episodes[0].mediaItem;
    }

    // 3. Koniec listy
    console.log('Brak następnego odcinka ani sezonu – autoplay zakończony');
    return undefined;
  }


  private handlePlayNextMovie(show: ShowModel | undefined, currentMediaItem: MediaItemModel | undefined): MediaItemModel | undefined {
    if (!show || !currentMediaItem) return;

    // Znajdź aktualny sezon
    const currentMovieIndex = show.movies.findIndex(
      movie => movie.mediaItem.id === currentMediaItem?.id
    );

    if (currentMovieIndex === -1) return;


    const nextMovie: MediaItemModel = show.movies[currentMovieIndex + 1].mediaItem;

    if (nextMovie) {
      return nextMovie;
    }

    return undefined;
  }

}
