import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent  implements OnInit {
  @Input() chat:any;
  @Input() current_user_id:any;
  time!:Date;

  constructor() { }

  ngOnInit() {
    this.time = new Date(this.chat.createdAt._seconds * 1000 + this.chat.createdAt._nanoseconds / 1000000);
  }

}
