import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Endpoints } from '../../endpoints/endpoints';
import { ApiResponseModel } from '../../models/api-response-model';

@Injectable({
  providedIn: 'root',
})
export class VideoApi {
  constructor(private http: HttpClient) {}

  public fullLibraryScan(): Observable<ApiResponseModel> {
    return this.http.post<ApiResponseModel>(Endpoints.videos.scan, {});
  }

  getIconBlob(rootPath: string | undefined): Observable<Blob> {
    if (!rootPath) {
      return of(new Blob()); // pusty blob
    }

    const url = `${Endpoints.videos.image}?path=${encodeURIComponent(
      rootPath + '/icon/icon.webp'
    )}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  getBackdropBlob(rootPath: string | undefined): Observable<Blob> {
    if (!rootPath) {
      return of(new Blob()); // pusty blob
    }

    const url = `${Endpoints.videos.image}?path=${encodeURIComponent(
      rootPath + '/backdrop/backdrop.jpg'
    )}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  getSubtitleBlob(rootPath: string | undefined, subtitleFileName: string): Observable<Blob> {
    if (!rootPath) {
      return of(new Blob()); // pusty blob
    }

    const url = `${Endpoints.videos.subtitles}?path=${encodeURIComponent(
      rootPath
    )}&subtitle=${encodeURIComponent(subtitleFileName)}`;

    return this.http.get(url, { responseType: 'blob' });
  }
}
