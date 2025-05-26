import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Dish } from '../../core/models/dish.model';
import { DishService } from '../../core/services/dish.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DishCardComponent } from '../../shared/components/dish-card/dish-card.component';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [MatPaginatorModule, MatIconModule, RouterModule, DishCardComponent]
})
export class HomeComponent implements OnInit {
  dishes: Dish[] = [];

  totalItems: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private readonly dishService: DishService) {}

  ngOnInit() {
    this.fetchDishes();
  }

  fetchDishes() {
    const page = this.currentPage + 1;

    this.dishService.getByPagination(page, this.pageSize).subscribe({
      next: (result) => {
        this.dishes = result.data;
        this.pageSize = result.limit;
        this.totalItems = result.total;
        this.currentPage = this.currentPage - 1;
      },
      error: (err) => {
        console.error('Error fetching dishes:', err);
      }
    })
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.fetchDishes();
  }
}
