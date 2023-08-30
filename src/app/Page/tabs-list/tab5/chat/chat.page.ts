import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { ChatService } from '../service/chat.service';
import { Observable, of, take } from 'rxjs';
import { collection, doc, onSnapshot, query } from 'firebase/firestore';
import { db } from 'src/main';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit,OnDestroy {
  public name: string = 'Sender';
  public isLoading: boolean = false;
  public message: any;
  public chats! : Observable<any[]>;
  public roomId: string = '';
  unsub1:any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  currentUserId!: any;
  model = {
    icon: 'chatbubbles-outline',
    title: 'No Conversation',
    color: 'warning',
  };

  constructor(
    private dataSharingService: DataSharingService,
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.dataSharingService.setData(false);
    this.name = this.route.snapshot.queryParams['name'];
    this.roomId = this.route.snapshot.params['id'];
    // this.getChatRoomMessages();
    this.refresh()
  }

  ngOnDestroy(): void {
    this.unsub1();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.chats) {
      this.content.scrollToBottom();
    }
  }

  refresh() {
    const chatRoomCollection =  collection(db,'ChatRoom',this.roomId,'chat') 
    this.unsub1 = onSnapshot(chatRoomCollection, (snapshot) => {
      this.getChatRoomMessages();
    });
  }

  getChatRoomMessages() {
    this.chatService.getChatRoomMessage(this.roomId).pipe(take(1)).subscribe((data: any) => {
      this.currentUserId = this.chatService.currentUserId;
      this.chats = of(data);
    });
  }

  async sendMessage() {
    if (!this.message || this.message.trim() == '') {
      return;
    }
    this.isLoading = true;
    this.chatService.sendMessage(this.message, this.roomId).pipe(take(1)).subscribe(() => {
      this.message = '';
      this.isLoading = false;
      this.scrollToBottom();
    });
  }

  showbar() {
    this.dataSharingService.setData(true);
  }
}
