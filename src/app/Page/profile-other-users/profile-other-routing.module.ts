import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileOtherUsersComponent } from './profile-other-users.component';
const routes: Routes = [
  {
    path: '',
    component: ProfileOtherUsersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileOtherRouting {}
