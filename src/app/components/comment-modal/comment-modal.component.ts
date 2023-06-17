import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/Authentication/auth.service';
import { config } from 'src/app/config/configuration';
// import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, Subscription, interval } from 'rxjs';
// import { Database,onValue, ref } from '@angular/fire/database'

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
  public name:string = '';
  // public comment: Observable<any> | undefined;
  // public ref: any
  options = { withCredentials: true };
  private subscription!: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private authService: AuthService,
    // private database: Database
  ) {
    // const itemCollection = collection(this.firestore, 'Comment');
    // this.item$ = collectionData(itemCollection);
    // this.item$.subscribe(async (data)=>{
    //   console.log(data)
    // })
    // const databaseref = ref(this.database, 'Comment')
    // onValue(databaseref, (snapshot)=>{
    //   console.log(snapshot.val())
    // })
  }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(async (logedIn) => {
      this.login = logedIn;
      this.refresh();
      this.authService.getName().subscribe((res)=>{
        this.name = res.Nickname
      })
    });
  }

  ngOnDestroy() {
    this.stopRefresh();
  }

  refresh() {
    this.getCom()
    this.subscription = interval(500).subscribe(() => {
      this.getCom()
    });
  }

  stopRefresh() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  deleteCom(index: number) {
    this.http.delete(config.API_URL + '/comment/del/' + this.titre + '/' + index, this.options).subscribe();
  }

  addComment(Ev: Event) {
    const inputElement = Ev.target as HTMLInputElement;
    let comment = inputElement.value;
    inputElement.value = '';
    this.http.put(config.API_URL + '/comment/add/' + this.titre, { comment: comment }, this.options).subscribe();
  }

  getCom() {
    this.http.get(config.API_URL + '/comment/comment/' + this.titre, this.options).subscribe((res: any) => {
      this.comments = res.comment;
      this.UserComenting = res.nameUserCom;
    });
  }
}
