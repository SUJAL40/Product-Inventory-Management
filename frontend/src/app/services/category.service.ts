import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../models/category.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8081/api/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(this.apiUrl).pipe(
      map(res => res.data)
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<ApiResponse<Category>>(this.apiUrl, category).pipe(
      map(res => res.data)
    );
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/${id}`, category).pipe(
      map(res => res.data)
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => void 0)
    );
  }
}
