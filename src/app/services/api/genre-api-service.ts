import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Endpoints} from '../../endpoints/endpoints';
import {GenreModel} from '../../models/show/genre-model';

@Injectable({
  providedIn: 'root'
})
export class GenreApiService {

  constructor(private http: HttpClient) { }

  public findAll(): Observable<GenreModel[]> {
    return this.http.get<GenreModel[]>(Endpoints.genre.findAll)
  }

  public findAllNames(): Observable<string[]> {
    return this.http.get<string[]>(Endpoints.genre.findAllNames)
  }

  updateGenresFromTmdb():Observable<any> {
    return this.http.post<any>(Endpoints.genre.update, {})
  }

}
