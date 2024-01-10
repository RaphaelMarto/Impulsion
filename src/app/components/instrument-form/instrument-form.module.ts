import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InstrumentFormComponent } from './instrument-form.component';


@NgModule({
  imports: [IonicModule, CommonModule, FormsModule,RouterModule, ReactiveFormsModule],
  declarations: [InstrumentFormComponent],
  exports: [InstrumentFormComponent],
})
export class InstrumentFormModule {}
