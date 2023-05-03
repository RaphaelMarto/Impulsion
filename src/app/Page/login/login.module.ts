import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { AuthModule } from '../../Authentication/auth.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    LoginRoutingModule,
    AuthModule,
  ],
  declarations: [LoginComponent],
})
export class LoginModule {}


