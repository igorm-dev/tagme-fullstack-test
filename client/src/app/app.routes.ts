import { Routes } from '@angular/router';
import { CreateDishComponent } from './pages/create-dish/create-dish.component';

export const routes: Routes = [
  {
    path: '',
    component: CreateDishComponent,
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  }
];
