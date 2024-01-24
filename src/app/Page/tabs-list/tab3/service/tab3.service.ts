import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../../../../config/configuration';
import { musicInterface } from 'src/app/interface/music.interface';
import { Observable, catchError, map, of, take } from 'rxjs';

@Injectable()
export class Tab3Service {
  constructor(private http: HttpClient) {}

  uploadAudio(audioFile: any, formValue: musicInterface): Observable<boolean> {
    const options = { withCredentials: true };
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('genre', formValue.genre);
    formData.append('name', formValue.name);
    formData.append('length', formValue.length);
    formData.append('desc', formValue.desc);

    return this.http.post(config.API_URL + '/music/upload', formData, options).pipe(
      take(1),
      map(() => true),
      catchError((error) => {
        console.log(error.message);
        return of(false);
      })
    );
  }
}
