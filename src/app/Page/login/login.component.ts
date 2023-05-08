import { Component, OnInit } from '@angular/core';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { AuthService } from '../../Authentication/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  private provider = new GoogleAuthProvider();
  public login: boolean = false;

  ngOnInit() {
    this.provider.addScope('email');
    this.provider.addScope('profile');
    this.checkCookie();
  }

  signInWithGoogle() {
    const auth = getAuth();
    signInWithPopup(auth, this.provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = await GoogleAuthProvider.credentialFromResult(
          result
        );
        //const token = credential!.idToken; googletoken

        const token = (await result.user.getIdTokenResult()).token;
        const connecter = await this.authService.login(token);
        if (connecter) {
          this.router.navigate(['/tabs/home']);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/tabs/home']);
  }

  checkCookie() {
    this.authService.checkCookie().subscribe(
      (response) => {this.login= response}
    );
}
}
