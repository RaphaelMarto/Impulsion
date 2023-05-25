import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab4Page } from './tab4.page';

import { Tab4RoutingModule } from './tab4-routing.module';
import { TabsProfilComponentModule } from 'src/app/components/tabs-profil-component/tabs-profil-component.module';
import { AuthModule } from 'src/app/Authentication/auth.module';
import { DataSharingServiceModule } from 'src/app/service/data-sharing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab4RoutingModule,
    AuthModule,
    ReactiveFormsModule,
    TabsProfilComponentModule,
    DataSharingServiceModule
  ],
  declarations: [Tab4Page],
})
export class Tab4PageModule {}