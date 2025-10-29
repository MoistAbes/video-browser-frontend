import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Endpoints } from '../../endpoints/endpoints';
import { ShowModel } from '../../models/show/show-model';
import { StructureTypeEnum } from '../../enums/structure-type-enum';
import { GenreTypeEnum } from '../../enums/genre-type-enum';

@Injectable({
  providedIn: 'root',
})
export class ShowApiService {
  constructor(private http: HttpClient) {}

  findById(showId: number): Observable<ShowModel> {
    return this.http.get<ShowModel>(Endpoints.show.findById + showId);
  }

  findAllShows(): Observable<ShowModel[]> {
    return this.http.get<ShowModel[]>(Endpoints.show.findAll);
  }

  findRandomShows(): Observable<ShowModel[]> {
    return this.http.get<ShowModel[]>(Endpoints.show.findRandom);
  }

  findRandomShowsByStructure(
    showStructure: StructureTypeEnum
  ): Observable<ShowModel[]> {
    return this.http.get<ShowModel[]>(
      `${Endpoints.show.findRandomByStructure}?structureType=${showStructure}`
    );
  }

  findShowByParentTitle(parentTitle: string): Observable<ShowModel> {
    return this.http.get<ShowModel>(
      Endpoints.show.findByParentTitle + '/' + parentTitle
    );
  }

  findWithRootPath(): Observable<ShowModel[]> {
    return this.http.get<ShowModel[]>(Endpoints.show.findWithRootPath);
  }

  addGenreToShow(showId: number, genreId: number): Observable<void> {
    return this.http.put<any>(
      Endpoints.show.addGenre + showId + '/' + genreId,
      {}
    );
  }

  removeGenreFromShow(showId: number, genreId: number): Observable<void> {
    return this.http.put<any>(
      Endpoints.show.removeGenre + showId + '/' + genreId,
      {}
    );
  }

  findRandomShowsByStructureAndGroupedByGenre(
    showStructure?: string
  ): Observable<Map<string, ShowModel[]>> {
    const base = Endpoints.show.findRandomShowsByStructureAndGroupedByGenre;
    const url =
      showStructure !== undefined
        ? `${base}?structureType=${showStructure}`
        : base;

    return this.http.get<Record<string, ShowModel[]>>(url).pipe(
      map((obj) => {
        // Object.entries daje [key, value][] — konwertujemy do Map
        return new Map(Object.entries(obj) as [string, ShowModel[]][]);
      })
    );
  }

  deleteShow(showId: number): Observable<any> {
    return this.http.delete<any>(Endpoints.show.deleteShow + showId);
  }
}
