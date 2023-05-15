import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsProfilComponentComponent } from './tabs-profil-component.component';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsProfilComponentComponent,
    children: [
      {
        path: 'musics',
        loadChildren: () =>
          import('../../Page/tabs-list/tab1/tab1.module').then(
            (m) => m.Tab1PageModule
          ),
      },
      {
        path: 'amis',
        loadChildren: () =>
          import('../../Page/tabs-list/tab2/tab2.module').then(
            (m) => m.Tab2PageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsProfilRoutingModule {}
