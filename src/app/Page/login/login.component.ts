import { Component, OnInit } from '@angular/core';
import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithCredential, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { AuthService } from '../../Authentication/auth.service';
import { GoogleAuth } from  '@codetrix-studio/capacitor-google-auth'
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { isPlatform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router, private location: Location) {
    if (!isPlatform('capacitor')) {
      GoogleAuth.initialize();
    }
  }

  private provider = new GoogleAuthProvider();
  public login: boolean = false;

  ngOnInit() {
    this.provider.addScope('email');
    this.provider.addScope('profile');
    this.checkLogIn();
  }

  async signInWithGoogle() {
    const auth = getAuth();
    const googleUser = await GoogleAuth.signIn();

    const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
    const result = await signInWithCredential(auth, credential);

    const token = (await result.user.getIdTokenResult()).token;
    const connecter = await this.authService.login(token);
    if (connecter) {
      this.authService.setLoggedInStatus(true);
      this.router.navigate(['/tabs/home']);
    }
  }

  async logout() {
    await GoogleAuth.signOut();
    this.authService.logout();
    this.authService.setLoggedInStatus(false);
    this.router.navigate(['/tabs/home']);
  }

  cancel() {
    this.location.back();
  }

  checkLogIn() {
    this.authService.isLoggedIn.subscribe((logedIn) => {
      this.login = logedIn;
    });
  }
}
