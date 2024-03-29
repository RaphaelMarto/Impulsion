import { CommentModalComponent } from './comment-modal.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommentModule } from '../comment/comment.module';


@NgModule({
  imports: [IonicModule, CommonModule, FormsModule,RouterModule, CommentModule],
  declarations: [CommentModalComponent],
  exports: [CommentModalComponent],
})
export class CommentModalModule {}
