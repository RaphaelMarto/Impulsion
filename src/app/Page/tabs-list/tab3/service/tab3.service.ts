import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../../../../config/configuration';
import { musicInterface } from 'src/app/interface/music.interface';
import { map, take } from 'rxjs';

@Injectable()
export class Tab3Service {
  constructor(private http: HttpClient) {}

  async uploadAudio(audioFile: any, formValue: musicInterface): Promise<boolean> {
    const options = { withCredentials: true };
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('genre', formValue.genre);
    formData.append('name', formValue.name);
    formData.append('length', formValue.length);
    formData.append('desc', formValue.desc);
    console.log(audioFile.size);
    return new Promise((resolve, reject) => {
      this.http.post(config.API_URL + '/music/upload', formData, options).pipe(take(1)).subscribe({
        next: () => resolve(true),
        error: (e) => {
          console.error(e);
          reject(e);
        },
      });
    });
  }

  getGenre() {
    return this.http.get(config.API_URL + '/music/genre').pipe(take(1)).pipe(
      map((response: any) => {
        return response.genre.map((genre: any) => ({
          name: genre.name,
          number: genre.number,
        }));
      })
    );
  }
}
