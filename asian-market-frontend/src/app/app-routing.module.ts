import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ErrorComponent} from './error/error.component';
import {AuthGuard} from './services/auth/auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./static-pages/static-pages.module').then(mod => mod.StaticPagesModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-pages/admin-pages.module').then(mod => mod.AdminPagesModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./user-pages/user-pages.module').then(mod => mod.UserPagesModule),
    canLoad: [AuthGuard]

  },
  { path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
