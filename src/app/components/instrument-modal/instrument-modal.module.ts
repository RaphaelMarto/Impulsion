import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InstrumentModalComponent } from './instrument-modal.component';
import { InstrumentFormModule } from '../instrument-form/instrument-form.module';


@NgModule({
  imports: [IonicModule, CommonModule, FormsModule,RouterModule, InstrumentFormModule],
  declarations: [InstrumentModalComponent],
  exports: [InstrumentModalComponent],
})
export class InstrumentModalModule {}
