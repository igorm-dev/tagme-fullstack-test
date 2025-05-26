import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { RouterLink } from '@angular/router';
import { Dish } from '../../../core/models/dish.model';
import { DishService } from '../../../core/services/dish.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dish-card',
  templateUrl: './dish-card.component.html',
  styleUrls: ['./dish-card.component.css'],
  standalone: true,
  imports: [MatCardModule, RouterLink, MatIconModule],
})
export class DishCardComponent {
  @Input() dish!: Dish;
  @Output() dishDeletedEvent = new EventEmitter<void>();

  constructor(
    private readonly dishService: DishService,
    private readonly dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  formattedPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }

  mapCategory(category: string): string {
    switch (category) {
      case 'STARTERS':
        return 'Entrada';
      case 'MAIN_COURSES':
        return 'Principal';
      case 'DESSERTS':
        return 'Sobremesa';
      case 'DRINKS':
        return 'Bebida';
      default:
        return 'Outro';
    }
  }

  confirmDelete(uuid: string) {
    this.dialog.open(DialogComponent, {
      data: {
        title: 'Excluir prato: ' + this.dish.title,
        content: 'Tem certeza de que deseja excluir este prato ?',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
      },
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.dishService.delete(uuid).subscribe({
          next: () => {
            this.showSuccess();
            this.dishDeletedEvent.emit();
          },
          error: (error) => {
            this.showError();
          }
        });
      }
    });
  }

  showSuccess() {
    this.snackBar.open('Prato deletado com sucesso!', 'Fechar', {
      panelClass: 'snackbar-success',
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  showError() {
    this.snackBar.open('Erro ao deletar prato!', 'Fechar', {
      panelClass: ['snackbar-error'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
