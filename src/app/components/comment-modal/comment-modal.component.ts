import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/Authentication/auth.service';
import { config } from 'src/app/config/configuration';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../main';
import { of, take } from 'rxjs';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss'],
})
export class CommentModalComponent implements OnInit {
  @Input() idMusic!: number;
  public login: any;
  public comments: any;
  public message: string = '';
  public isLoading: boolean = false;
  options = { withCredentials: true };

  constructor(private modalCtrl: ModalController, private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(async (logedIn) => {
      this.login = logedIn;
      this.getCom();
    });
  }

  refresh(event:any) {
    this.getCom();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  addComment() {
    this.isLoading = true;
    this.http
      .post(config.API_URL + '/comment/add/' + this.idMusic, { comment: this.message, reply: 1 }, this.options)
      .pipe(take(1))
      .subscribe(() =>{
        this.isLoading = false;
        this.message = ''
        this.refresh(true);
      });
  }

  getCom() {
    this.http
      .get(config.API_URL + '/comment/comment/' + this.idMusic + '/1', this.options)
      .pipe(take(1))
      .subscribe((res: any) => {
        this.comments = of(res);
      });
  }
}
