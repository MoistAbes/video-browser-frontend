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

  public getThumbnails(rootFolderPath: string): Observable<string[]> {
    const params = new HttpParams().set('rootFolderPath', rootFolderPath);
    return this.http.get<string[]>(Endpoints.videos.thumbnails, { params });
  }


  getSubtitles(rootFolderPath: string, subtitleTitle: string): Observable<any> {
    const params = new HttpParams().set('path', rootFolderPath);
    return this.http.get<any>(Endpoints.videos.subtitles + '/' + subtitleTitle, { params });
  }



}
