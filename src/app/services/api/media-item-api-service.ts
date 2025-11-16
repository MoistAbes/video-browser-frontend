import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoints } from '../../endpoints/endpoints';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class MediaItemApiService {
  constructor(private http: HttpClient) {}

  public convertAudioCodec(): Observable<any> {
    return this.http.put<any>(Endpoints.mediaItem.convertAudioCodec, {});
  }
}
