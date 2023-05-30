import { Injectable } from "@angular/core";
import { AuthService } from "../Authentication/auth.service";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { first, map } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.checkCookie().pipe(
      first(), // Take the first emitted value
      map((isLoggedIn) => {
        console.log(isLoggedIn)
        if (isLoggedIn) {
          return true; // User is logged in, allow navigation
        } else {
          this.router.navigate(['/tabs/login']); // User is not logged in, redirect to login page
          return false;
        }
      })
    );
  }
}