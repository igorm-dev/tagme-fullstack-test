import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dish } from '../models/dish.model';
import { CreateDishForm } from '../../pages/create-dish/create-dish.interface';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  // TODO: Colocar em variável de ambiente
  private baseUrl = 'http://localhost:3000/dish';

  constructor(private http: HttpClient) {}

  getByPagination(page: number = 1, limit: number = 10): Observable<{ data: Dish[]; total: number; page: number; limit: number }> {
    return this.http.get<{ data: Dish[]; total: number; page: number; limit: number }>(
      `${this.baseUrl}/paginated`,
      {
        params: {
          page: page.toString(),
          limit: limit.toString(),
        }
      }
    );
  }

  getByUuid(uuid: string): Observable<Dish> {
    return this.http.get<Dish>(`${this.baseUrl}/${uuid}`);
  }

  create(book: CreateDishForm): Observable<void> {
    const formData = new FormData();

    formData.append('title', book.title);
    formData.append('description', book.description);
    formData.append('category', book.category);
    formData.append('price', book.price.toString());
    formData.append('isAvailable', book.isAvailable.toString());
    formData.append('image', book.image as Blob);

    return this.http.post<void>(this.baseUrl, formData);
  }

  update(dish: Dish): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${dish.uuid}`, dish);
  }

  delete(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${uuid}`);
  }
}
