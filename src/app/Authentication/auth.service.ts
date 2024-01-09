import { HttpClient } from '@angular/common/http';
import { config } from '../config/configuration';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient,private router: Router) {}

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
    this.http.get(config.API_URL + '/auth/logout', options).pipe(take(1)).subscribe(()=>{
      location.reload();
    }
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

  checkCondition(){
    const options = { withCredentials: true };
    return this.http.get(config.API_URL + '/user/condition', options);
  }

  getIdUser(){
    const options = { withCredentials: true };
    return this.http.get(config.API_URL + '/auth/userId', options)
  }
}
