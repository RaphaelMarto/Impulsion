import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() idMusic: number = 0;
  @Input() numberReply: number = 0;
  @Output() cancelAction = new EventEmitter<boolean>();
  comments2: any;
  public name: any = '';
  public replyCommentVisible: boolean = false;
  public replyCommentText: string = '';
  public showMoreCom: boolean = false;
  public marginValue: number = 15;
  ApiUrl: string = config.API_URL;
  options = { withCredentials: true };
  public login!: boolean;
  public showLess:boolean = false;

  constructor(private modalCtrl: ModalController, private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(async (logedIn) => {
      this.login = logedIn;
      if (this.login) {
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

  showMoreComment(commentsId: number) {
    this.getReply(commentsId);
  }

  refresh(commentsId: number) {
    this.getReply(commentsId);
  }

  getReply(CommentId: number) {
    this.http
      .get(config.API_URL + '/comment/comment/' + this.idMusic + '/' + CommentId, this.options)
      .pipe(take(1))
      .subscribe((res: any) => {
        console.log(res);
        this.comments2 = of(res);
        this.showMoreCom = true;
        this.numberReply++;
        this.marginValue = this.marginValue * this.numberReply;
      });
  }

  deleteCom(CommentId: number) {
    this.http
      .delete(config.API_URL + '/comment/del/' + CommentId, this.options)
      .pipe(take(1))
      .subscribe(() => {
        this.cancelAction.emit(true);
      });
  this.cancelAction.emit(false);
  }

  addComment(text: string, CommentId: number) {
    this.http
      .post(config.API_URL + '/comment/add/' + this.idMusic, { comment: text, reply: CommentId }, this.options)
      .pipe(take(1))
      .subscribe(() => {
        this.refresh(CommentId);
      });
  }

  cancelAnswer(bool: boolean) {
    this.replyCommentVisible = !bool;
  }

  toggleComment() {
    this.showLess = !this.showLess;
  }
}
