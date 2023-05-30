import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPage } from './login.page';
import { LoginPageRoutingModule } from './login-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, LoginPageRoutingModule],
  declarations: [LoginPage],
})
export class LoginPageModule {}
