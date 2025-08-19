import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Endpoints} from '../../endpoints/endpoints';
import {ShowModel} from '../../models/show-model';

@Injectable({
  providedIn: 'root'
})
export class ShowApiService {

  constructor(private http: HttpClient) { }

  findAllShows(): Observable<ShowModel[]> {
    return this.http.get<ShowModel[]>(Endpoints.show.findAll)
  }

  findRandomShows(): Observable<ShowModel[]> {
    return this.http.get<ShowModel[]>(Endpoints.show.findRandom)
  }


  findShowByParentTitle(parentTitle: string): Observable<ShowModel> {
    return this.http.get<ShowModel>(Endpoints.show.findByParentTitle + '/' + parentTitle)
  }

  findWithRootPath(): Observable<ShowModel[]> {
    return this.http.get<ShowModel[]>(Endpoints.show.findWithRootPath);
  }
}
