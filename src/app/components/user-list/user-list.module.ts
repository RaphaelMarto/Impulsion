import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserListComponent } from './user-list.component';


@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [UserListComponent],
  exports: [UserListComponent],
})
export class UserListModule {}
