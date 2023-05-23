import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Page/login/login.component';
import { ProfileOtherUsersComponent } from './Page/profile-other-users/profile-other-users.component';

const routes: Routes = [
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
    // redirectTo: 'login',
  },
  {
    path: '',
    loadChildren: () => import('./components/tabs-list/tabs-list.module').then((m) => m.TabsListModule),
  },
  {
    path: 'otherProfile/:id',
    component: ProfileOtherUsersComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
