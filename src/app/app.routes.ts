import { Routes } from '@angular/router';
import { ReviewComponent } from './pages/review/review.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'review',
  },
  {
    path: 'review',
    component: ReviewComponent,
  }
];
