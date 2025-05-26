import { Routes } from '@angular/router';
import { CreateDishComponent } from './pages/create-dish/create-dish.component';
import { HomeComponent } from './pages/home/home.component';
import { EditDishComponent } from './pages/edit-dish/edit-dish.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'create',
    component: CreateDishComponent,
  },
  {
    path: 'edit/:uuid',
    component: EditDishComponent,
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  }
];
