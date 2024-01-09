import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/Authentication/auth.service';
import { config } from 'src/app/config/configuration';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  currentUserId!: number;
  options = { withCredentials: true };

  constructor(private auth: AuthService, private http: HttpClient) {
    this.auth.getIdUser().subscribe((data: any) => {
      this.currentUserId = data;
    }); 
  }

  getAllUserId(): Observable<Object> {
    return this.http.get(config.API_URL + '/auth/all/id', this.options);
  }

  async createChatRoom(user_id: string) {
    return this.http.post(config.API_URL + '/chat/chatRoom', { otherId: user_id }, this.options);
  }

  getChatRooms() {
    return this.http.get(config.API_URL + '/chat/chatRoom', this.options);
  }

  sendMessage(msg: string, roomId: string) {
    return this.http.post(config.API_URL + '/chat/message', { message: msg, roomId: roomId }, this.options);
  }

  getChatRoomMessage(chatRoomId: string) {
    return this.http.get(config.API_URL + '/chat/message/' + chatRoomId, this.options);
  }
}
