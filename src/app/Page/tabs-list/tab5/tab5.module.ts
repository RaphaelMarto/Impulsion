import { HeaderModule } from './../../../components/header/header.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab5Page } from './tab5.page';

import { Tab5RoutingModule } from './tab5-routing.module';
import { UserListComponent } from 'src/app/components/user-list/user-list.component';
import { EmptyScreenModule } from 'src/app/components/empty-screen/empty-screen.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab5RoutingModule,
    HeaderModule,
    EmptyScreenModule
  ],
  declarations: [Tab5Page,UserListComponent]
})
export class Tab5PageModule {}