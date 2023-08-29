import { HeaderModule } from './../../../components/header/header.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab5Page } from './tab5.page';

import { Tab5RoutingModule } from './tab5-routing.module';
import { EmptyScreenModule } from 'src/app/components/empty-screen/empty-screen.module';
import { PipeModule } from 'src/pipe/pipe.module';
import { UserListModule } from 'src/app/components/user-list/user-list.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab5RoutingModule,
    HeaderModule,
    EmptyScreenModule,
    PipeModule,
    UserListModule
  ],
  declarations: [Tab5Page]
})
export class Tab5PageModule {}