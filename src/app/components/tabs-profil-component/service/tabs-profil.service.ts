import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../../../config/configuration';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TabsProfilService {
  constructor(private http: HttpClient) {}

  getAllMusicUser(): Observable<{}> {
    const options = { withCredentials: true };
    return this.http.get(config.API_URL + '/music/user/all', options).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getAllFollow() {
    const options = { withCredentials: true };
    return this.http.get(config.API_URL + '/follow/all', options).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  deleteMusic(musicId: number) {
    const options = { withCredentials: true };
    return this.http.delete(config.API_URL + '/music/user/music/' + musicId, options);
  }

  deleteFollow(followedId:any) {
    const options = { withCredentials: true };
    return this.http.delete(config.API_URL + '/follow/' + followedId, options);
  }
}
