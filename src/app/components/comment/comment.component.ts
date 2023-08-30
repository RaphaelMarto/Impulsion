import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { of, take } from 'rxjs';
import { AuthService } from 'src/app/Authentication/auth.service';
import { config } from 'src/app/config/configuration';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  @Input() comments: any;
  @Input() UserComenting: string = '';
  @Input() titre: string = '';
  @Input() docId: string = '';
  @Input() paths: string = '';
  @Input() moreCom: number = 0;
  @Input() numberReply:number = 0;
  @Input() picture:string= '';
  comments2: any;
  public UserComenting2: string[]=[];
  public moreCom2: number[] = [];
  public docId2:string[]=[];
  public paths2:string[]=[];
  public picture2:string[]=[];
  public name: any = '';
  public replyCommentVisible: boolean = false;
  public replyCommentText: string = '';
  public showMoreCom: boolean = false;
  public marginValue:number=15;
  ApiUrl:string = config.API_URL;
  options = { withCredentials: true };
  public login!: boolean;
  unsubscribe: any;

  constructor(private modalCtrl: ModalController, private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(async (logedIn) => {
      this.login = logedIn;
      if(this.login){
        this.authService.getName().subscribe((res) => {
          this.name = res.Nickname;
        });
      }
    });
  }

  showReplyComment() {
    this.replyCommentVisible = true;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  showMoreComment() {
    this.getReply()
  }

  
  getReply(){
    this.http
      .post(config.API_URL + '/comment/comment/reply/'+ this.docId, {path:this.paths}, this.options)
      .pipe(take(1))
      .subscribe((res: any) => {
        this.comments2 = of(res.data);
        this.UserComenting2 = res.name;
        this.docId2 = res.docId;
        this.paths2 = res.path;
        this.moreCom2 = res.moreCom
        this.picture2 = res.pictures
        this.showMoreCom = true;
        this.numberReply++;
        this.marginValue =this.marginValue*this.numberReply;
        console.log(this.paths)
      });
  }

  deleteCom(path:string) {
    this.http
      .put(config.API_URL + '/comment/del/' + this.docId + '/' + this.titre, {path:path, numReply:this.numberReply}, this.options)
      .pipe(take(1))
      .subscribe();
  }

  addComment({ text, docId }: { text: string; docId: null | string }) {
    this.http
      .post(config.API_URL + '/comment/add/reply/' + docId+'/'+this.titre, { comment: text, path: this.paths }, this.options)
      .pipe(take(1))
      .subscribe();
  }

  cancelAnswer(bool: boolean) {
    this.replyCommentVisible = !bool;
  }
}
