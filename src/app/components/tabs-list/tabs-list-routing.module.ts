import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsListComponent } from './tabs-list.component';
import { AuthGuard } from 'src/app/guards/AuthGuard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsListComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../../Page/tabs-list/tab1/tab1.module').then((m) => m.Tab1PageModule),
      },
      {
        path: 'search',
        loadChildren: () => import('../../Page/tabs-list/tab2/tab2.module').then((m) => m.Tab2PageModule),
      },
      {
        path: 'music',
        canActivate: [AuthGuard],
        loadChildren: () => import('../../Page/tabs-list/tab3/tab3.module').then((m) => m.Tab3PageModule),
      },
      {
        path: 'profil',
        canActivate: [AuthGuard],
        loadChildren: () => import('../../Page/tabs-list/tab4/tab4.module').then((m) => m.Tab4PageModule),
      },
      {
        path: 'login',
        loadChildren: () => import('../../Page/tabs-list/login/login.module').then((m) => m.LoginPageModule),
      },
      {
        path: 'chat',
        canActivate: [AuthGuard],
        loadChildren: () => import('../../Page/tabs-list/tab5/tab5.module').then((m) => m.Tab5PageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsListRoutingModule {}
