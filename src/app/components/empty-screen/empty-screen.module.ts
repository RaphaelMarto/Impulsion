import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmptyScreenComponent } from './empty-screen.component';


@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [EmptyScreenComponent],
  exports: [EmptyScreenComponent],
})
export class EmptyScreenModule {}
