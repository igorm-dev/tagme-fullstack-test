import { Component, Input } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { RouterLink } from '@angular/router';
import { Dish } from '../../../core/models/dish.model';

@Component({
  selector: 'app-dish-card',
  templateUrl: './dish-card.component.html',
  styleUrls: ['./dish-card.component.css'],
  standalone: true,
  imports: [MatCardModule, RouterLink, MatIconModule],
})
export class DishCardComponent {
  @Input() dish!: Dish;

  formattedPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }
}
