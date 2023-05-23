import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileOtherUsersComponent } from './profile-other-users.component';

import { ProfileOtherRouting } from './profile-other-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, ProfileOtherRouting],
  declarations: [ProfileOtherUsersComponent],
})
export class ProfileOtherModule {}
