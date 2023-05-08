import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSharingService } from './data-sharing.service';


@NgModule({
  imports: [IonicModule, CommonModule, HttpClientModule],
  providers: [DataSharingService],
})
export class DataSharingServiceModule {}
