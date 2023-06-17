import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab4Page } from './tab4.page';

import { Tab4RoutingModule } from './tab4-routing.module';
import { TabsProfilComponentModule } from 'src/app/components/tabs-profil-component/tabs-profil-component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab4RoutingModule,
    ReactiveFormsModule,
    TabsProfilComponentModule,
  ],
  declarations: [Tab4Page],
})
export class Tab4PageModule {}