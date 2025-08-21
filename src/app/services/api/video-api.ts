import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Endpoints} from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})
export class VideoApi {

  constructor(private http: HttpClient) { }

  public scanAllVideos(): Observable<any> {
    return this.http.get<any>(Endpoints.videos.scan)
  }

}
