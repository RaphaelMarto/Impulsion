import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from '../../../../config/configuration';

@Injectable()
export class Tab3Service{
    constructor(private http:HttpClient){}

    async uploadAudio(audioFile:any):Promise<any>{
      const formData = new FormData();
      formData.append('audio', audioFile);
      console.log(audioFile.size);
      await this.http
        .post(config.API_URL + '/music', formData)
        .subscribe((response) => {
          console.log(response);
          return 'Upload successful!';
        });
    }
}