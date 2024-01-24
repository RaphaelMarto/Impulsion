import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { config } from 'src/app/config/configuration';


@Component({
  selector: 'app-condition-utilisation',
  templateUrl: './condition-utilisation.component.html',
  styleUrls: ['./condition-utilisation.component.scss'],
})
export class ConditionUtilisationComponent  implements OnInit {

  constructor(private router: Router,private http: HttpClient) { }

  ngOnInit() {}

  acceptConditions() {
    const options = { withCredentials: true };
    this.http.put(config.API_URL + '/user/condition',{}, options).subscribe();
    this.router.navigate(['/tabs/home']);
  }
}
