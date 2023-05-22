import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthModule } from '../../Authentication/auth.module';
import { TabsProfilComponentComponent } from './tabs-profil-component.component';
import { RouterModule } from '@angular/router';
import { TabsProfilRoutingModule } from './tabs-profil-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsProfilService } from './service/tabs-profil.service';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AuthModule,
    RouterModule,
    TabsProfilRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [TabsProfilComponentComponent],
  exports: [TabsProfilComponentComponent],
  providers: [TabsProfilService],
})
export class TabsProfilComponentModule {}
