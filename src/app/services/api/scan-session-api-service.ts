import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Endpoints } from '../../endpoints/endpoints';
import { ScanSessionModel } from '../../models/camunda/scan-session-model';

@Injectable({
  providedIn: 'root',
})
export class ScanSessionApiService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<ScanSessionModel[]> {
    return this.http.get<ScanSessionModel[]>(Endpoints.scanSession.findAll);
  }
}
