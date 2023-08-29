import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatBoxComponent } from './chat-box.component';
import { PipeModule } from 'src/pipe/pipe.module';


@NgModule({
  imports: [IonicModule, CommonModule, FormsModule,PipeModule],
  declarations: [ChatBoxComponent],
  exports: [ChatBoxComponent],
})
export class ChatBoxModule {}
