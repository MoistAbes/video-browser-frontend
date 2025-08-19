import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CategoryModel} from '../../models/category-model';
import {Endpoints} from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})
export class CategoryApiService {

  constructor(private http: HttpClient) { }


  findAllCategories(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>(Endpoints.category.findAll);
  }

}
