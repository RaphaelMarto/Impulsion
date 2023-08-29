import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';

import { EmptyScreenModule } from 'src/app/components/empty-screen/empty-screen.module';
import { ChatBoxModule } from 'src/app/components/chat-box/chat-box.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    EmptyScreenModule,
    ChatBoxModule,
  ],
  declarations: [ChatPage],
})
export class ChatPageModule {}
