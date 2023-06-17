import { HttpClient } from '@angular/common/http';
import { config } from '../config/configuration';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  async login(token: string): Promise<boolean> {
    const options = { withCredentials: true };
    try {
      const response: any = await this.http.post(config.API_URL + '/auth/login', { token }, options).toPromise();
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

  checkCookie(): Observable<any> {
    const options = { withCredentials: true };
    return this.http.get<boolean>(config.API_URL + '/auth/check-cookie', options);
  }

  setLoggedInStatus(isLoggedIn: boolean) {
    this.isLoggedInSubject.next(isLoggedIn);
  }

  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$;
  }

  getName(): Observable<any> {
    const options = { withCredentials: true };
    return this.http.get(config.API_URL + '/auth/get-name', options);
  }
}
