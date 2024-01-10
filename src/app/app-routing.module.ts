import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Page/login/login.component';
import { ProfileOtherUsersComponent } from './Page/profile-other-users/profile-other-users.component';
import { ConditionUtilisationComponent } from './Page/condition-utilisation/condition-utilisation.component';

const routes: Routes = [
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
    // redirectTo: 'login',
  },
  {
    path:'condition',
    component:ConditionUtilisationComponent,
  },
  {
    path: '',
    loadChildren: () => import('./components/tabs-list/tabs-list.module').then((m) => m.TabsListModule),
  },
  {
    path: 'otherProfile/:id',
    component: ProfileOtherUsersComponent,
  },
  {
    path: 'admin',
    loadChildren: () => import('./Page/admin/admin.module').then( m => m.AdminPageModule)
  },  {
    path: 'statistics',
    loadChildren: () => import('./Page/statistics/statistics.module').then( m => m.StatisticsPageModule)
  },


];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
