import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoints } from '../../endpoints/endpoints';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class SeasonApiService {

  constructor(private http: HttpClient) { }

   deleteSeason(seasonId: number): Observable<any> {
      return this.http.delete<any>(Endpoints.season.deleteSeasonById + seasonId);
    }

}
