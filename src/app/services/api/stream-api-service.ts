import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Endpoints } from '../../endpoints/endpoints';

export interface StreamAuthorizeResponse {
  key: string;
}

@Injectable({
  providedIn: 'root'
})
export class StreamApiService {

  constructor(private http: HttpClient) { }

 public authorizeStream(): Observable<string> {
  return this.http.get<StreamAuthorizeResponse>(Endpoints.stream.authorize)
                  .pipe(map(response => response.key));
}

}
