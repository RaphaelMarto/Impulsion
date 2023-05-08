import { HttpClient } from '@angular/common/http';
import { config } from '../config/configuration';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  async login(token: string): Promise<boolean> {
    const options = { withCredentials: true };
  try {
    const response:any = await this.http.post(config.API_URL + '/auth/login', { token }, options).toPromise();
    console.log(response.res);
    return response.res;
  } catch (error) {
    console.error('Error sending token:', error);
    return false;
  }
  }

  logout(): void {
    const options = { withCredentials: true };
    this.http.get(config.API_URL + '/auth/logout', options).subscribe(
      (response) => console.log('sent successfully', response),
      (error) => console.error('Error sending token:', error)
    );
  }

  checkCookie(): Observable<any>{
    const options = { withCredentials: true };
    return this.http.get(config.API_URL + '/auth/check-cookie', options).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
