import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ConditionUtilisationComponent } from './condition-utilisation.component';

import { ConditionRoutingModule } from './condition-utilisation-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ConditionRoutingModule,
  ],
  declarations: [ConditionUtilisationComponent],
})
export class conditionUtilisationModule {}


