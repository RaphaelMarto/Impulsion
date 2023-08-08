import { CommentFormComponent } from './comment-form.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [IonicModule, CommonModule, FormsModule,RouterModule, ReactiveFormsModule],
  declarations: [CommentFormComponent],
  exports: [CommentFormComponent],
})
export class CommentFormModule {}
