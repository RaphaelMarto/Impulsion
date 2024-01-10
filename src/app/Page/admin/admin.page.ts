import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { config } from '../../config/configuration';
import { take } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  public segment: string = 'request';
  public segment2: string = 'music';
  items: any;
  options = { withCredentials: true };

  constructor(private http: HttpClient,private location: Location) { }

  ngOnInit() {
    this.getRequest()
  }

  onSegmentChanged(event: any) {
    this.segment = event.target.value;
  }

  onSegmentChanged2(event: any) {
    this.segment2 = event.target.value;
  }

  getRequest(){
    this.http.get(config.API_URL + "/music/instrumentTemp", this.options).pipe(take(1)).subscribe((res:any)=>{
      this.items = res;
    })
  }

  validate(name:string,id:number){
    this.http.post(config.API_URL + "/music/instrumentTemp/accepted", {name:name,id:id} ,this.options).pipe(take(1)).subscribe((res:any)=>{
      this.getRequest()
    })
  }

  deleteReq(id:number){
    this.http.delete(config.API_URL + "/music/instrumentTemp/"+ id ,this.options).pipe(take(1)).subscribe((res:any)=>{
      this.getRequest()
    })
  }

  goBack() {
    this.location.back();
  }
}
