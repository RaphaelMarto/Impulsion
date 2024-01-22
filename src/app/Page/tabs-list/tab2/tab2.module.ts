import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderModule } from './../../../components/header/header.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { AddressModalModule } from 'src/app/components/address-popup/address-popup.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    HeaderModule,
    HttpClientModule,
    ReactiveFormsModule,
    AddressModalModule,
  ],
  declarations: [Tab2Page],
})
export class Tab2PageModule {}
