import { HeaderModule } from './../../../components/header/header.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { Tab3Service } from './service/tab3.service';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab3PageRoutingModule,
    HeaderModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  declarations: [Tab3Page],
  providers: [Tab3Service],
})
export class Tab3PageModule {}
