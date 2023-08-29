import { NgModule } from "@angular/core";
import { TimeOrDatePipe } from "./time-or-date.pipe";
import { CommonModule, DatePipe } from "@angular/common";



@NgModule({
    declarations: [
      TimeOrDatePipe
    ],
    exports: [
      TimeOrDatePipe
    ],
    providers: [
      DatePipe
    ],
    imports: [
      CommonModule 
    ]
  })
  export class PipeModule { }
  