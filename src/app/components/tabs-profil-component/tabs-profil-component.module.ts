import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthModule } from '../../Authentication/auth.module';
import { TabsProfilComponentComponent } from './tabs-profil-component.component';
import { RouterModule } from '@angular/router';
import { TabsProfilRoutingModule } from './tabs-profil-routing.module';

@NgModule({
  imports: [CommonModule, IonicModule, AuthModule, RouterModule,TabsProfilRoutingModule],
  declarations: [TabsProfilComponentComponent],
})
export class TabsProfilComponentModule {}
