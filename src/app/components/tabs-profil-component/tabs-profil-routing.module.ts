import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsProfilComponentComponent } from './tabs-profil-component.component';

const routes: Routes = [
  {
    path: '',
    component: TabsProfilComponentComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsProfilRoutingModule {}
