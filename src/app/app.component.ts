import { Component, OnInit } from '@angular/core';
import { AuthService } from './Authentication/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private authService:AuthService) {}

  ngOnInit(): void {
    this.authService.checkCookie().subscribe((response) => this.authService.setLoggedInStatus(response));
  }
}
