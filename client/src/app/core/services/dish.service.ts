import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dish } from '../models/dish.model';
import { CreateDishForm } from '../../pages/create-dish/create-dish.interface';
import { EditDishForm } from '../../pages/edit-dish/edit-dish.interface';

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

  create(dish: CreateDishForm): Observable<void> {
    const formData = new FormData();

    formData.append('title', dish.title);
    formData.append('description', dish.description);
    formData.append('category', dish.category);
    formData.append('price', dish.price.toString());
    formData.append('isAvailable', dish.isAvailable.toString());
    formData.append('image', dish.image as Blob);

    return this.http.post<void>(this.baseUrl, formData);
  }

  update(uuid: string, dish: EditDishForm): Observable<void> {
    const formData = new FormData();

    formData.append('title', dish.title);
    formData.append('description', dish.description);
    formData.append('category', dish.category);
    formData.append('price', dish.price.toString());
    formData.append('isAvailable', dish.isAvailable.toString());
    formData.append('image', dish.image as Blob);

    return this.http.put<void>(`${this.baseUrl}/${uuid}`, formData);
  }

  delete(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${uuid}`);
  }
}
