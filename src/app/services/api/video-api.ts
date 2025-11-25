import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Endpoints } from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root',
})
export class VideoApi {
  constructor(private http: HttpClient) {}

  public scanAllVideos(): Observable<any> {
    return this.http.get<any>(Endpoints.videos.scan);
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
}
