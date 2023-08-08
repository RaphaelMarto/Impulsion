import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/Authentication/auth.service';
import { config } from 'src/app/config/configuration';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../main';
import { of, take } from 'rxjs';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss'],
})
export class CommentModalComponent implements OnInit, OnDestroy {
  @Input() titre: string = '';
  public login: any;
  public UserComenting: string[] = [];
  public comments: any;
  public name: string = '';
  public message: string = '';
  public isLoading: boolean = false;
  public docId:string[]=[];
  public paths:string[]=[];
  public moreCom:number[]=[];
  options = { withCredentials: true };
  private unsubscribe: any;

  constructor(private modalCtrl: ModalController, private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(async (logedIn) => {
      this.login = logedIn;
      this.refresh();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  async refresh() {
    this.unsubscribe = onSnapshot(collection(db,'Comment') , (snapshot) => {
      this.getCom();
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  addComment() {
    this.isLoading = true;
    this.http
      .post(config.API_URL + '/comment/add/' + this.titre, { comment: this.message }, this.options)
      .pipe(take(1))
      .subscribe(() =>{
        this.isLoading = false;
        this.message = ''
      });
  }

  getCom() {
    this.http
      .get(config.API_URL + '/comment/comment/' + this.titre, this.options)
      .pipe(take(1))
      .subscribe((res: any) => {
        this.comments = of(res.data);
        this.UserComenting = res.name;
        this.docId = res.docId;
        this.paths = res.path;
        this.moreCom = res.moreCom;
      });
  }
}
