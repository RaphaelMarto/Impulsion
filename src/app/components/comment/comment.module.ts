import { CommentComponent } from './comment.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommentFormModule } from '../comment-form/comment-form.module';


@NgModule({
  imports: [IonicModule, CommonModule, FormsModule,RouterModule, CommentFormModule],
  declarations: [CommentComponent],
  exports: [CommentComponent],
})
export class CommentModule {}
