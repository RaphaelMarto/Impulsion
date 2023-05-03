import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@NgModule({
  imports: [IonicModule, CommonModule, HttpClientModule],
  providers: [AuthService],
})
export class AuthModule {}
