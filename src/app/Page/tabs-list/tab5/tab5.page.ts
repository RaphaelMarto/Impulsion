import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { ChatService } from './service/chat.service';
import { Observable, of, take } from 'rxjs';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from 'src/main';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit,OnDestroy {
  public isIOS: boolean;
  public segment: string = 'chats';
  public open_new_chat: boolean = false;
  public user!: Array<any>;
  public loading: boolean = false;
  public chatRooms!: Observable<any[]>;
  public userFiltered!: Array<any>;
  unsub1: any;
  model = {
    icon: 'chatbubbles-outline',
    title: 'No Chats',
    color: 'danger',
  };
  @ViewChild('new_chat') modal!: ModalController;
  @ViewChild('popover') popover!: PopoverController;

  constructor(private platform: Platform, private router: Router, private chatService: ChatService) {
    this.isIOS = this.platform.is('ios');
  }
  ngOnInit() {
    this.refresh();
  }

  ngOnDestroy(): void {
    this.unsub1();
  }

  openSetting() {
    this.popover.dismiss();
  }

  onSegmentChanged(event: any) {
    this.segment = event.target.value;
  }

  newChat() {
    this.open_new_chat = true;
    if (!this.user) {
      this.getUsers();
    }
  }

  getUsers() {
    this.chatService
      .getAllUserId()
      .pipe(take(1))
      .subscribe((res: any) => {
        this.user = res;
        this.userFiltered =res;
      });
  }

  cancel() {
    this.modal.dismiss();
    this.open_new_chat = false;
  }

  onWillDismiss(event: any) {}

  getChatRooms() {
    this.chatService
      .getChatRooms()
      .pipe(take(1))
      .subscribe((data: any) => {
        this.chatRooms = of(data.user);
      });
  }

  refresh() {
    const chatRoomCollection = collection(db,'ChatRoom');
    this.unsub1 = onSnapshot(chatRoomCollection, (snapshot) => {
      this.getChatRooms();
    });
  }

  async startChat(item: any) {
    this.loading = true;
    const navData: NavigationExtras = {
      queryParams: {
        name: item.Nickname,
      },
    };

    (await this.chatService.createChatRoom(item.UID)).pipe(take(1)).subscribe((res: any) => {
      const id = res.id;
      this.cancel();
      this.loading = false;
      this.router.navigate(['/tabs/chat/private', id], navData);
    });
  }

  getChat(item: any) {
    const navData: NavigationExtras = {
      queryParams: {
        name: item.Nickname,
      },
    };
    this.router.navigate(['/tabs/chat/private', item?.roomsId], navData);
  }

  onSearch(event: any) {
    this.userFiltered = this.user.filter((obj: any) =>
      obj.Nickname.toLowerCase().includes(event.target.value.toLowerCase())
    );
  }
}
