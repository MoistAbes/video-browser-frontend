import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {VideoInfoModel} from '../../models/video-info-model';
import {Observable} from 'rxjs';
import {Endpoints} from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})
export class VideoInfoApiService {

  constructor(private http: HttpClient) { }

  public findAllVideoInfo(): Observable<VideoInfoModel[]> {
    return this.http.get<VideoInfoModel[]>(Endpoints.videoInfo.findAll);
  }

  public findAllVideoInfoSmall(): Observable<VideoInfoModel[]> {
    return this.http.get<VideoInfoModel[]>(Endpoints.videoInfo.findAllSmall);
  }

  public findAllVideoInfoParentTitle(): Observable<VideoInfoModel[]> {
    return this.http.get<VideoInfoModel[]>(Endpoints.videoInfo.findAllParentTitle);
  }

  public findAllVideoInfoByParentTitle(parentTitle: string): Observable<VideoInfoModel[]> {
    return this.http.get<VideoInfoModel[]>(`${Endpoints.videoInfo.findAllByParentTitle}?parentTitle=${encodeURIComponent(parentTitle)}`);
  }

}


