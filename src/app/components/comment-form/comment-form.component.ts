import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
})
export class CommentFormComponent  implements OnInit {
  @Input() submitLabel!: string;
  @Input() hasCancelButton: boolean=true;
  @Input() initialText: string='';

  @Output() handleSubmit = new EventEmitter<string>()
  @Output() cancelAction = new EventEmitter<boolean>()

  form!: FormGroup

  constructor(private fb:FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      title:[this.initialText, Validators.required],
    })
  }

  onSubmit(){
    this.handleSubmit.emit(this.form.value.title)
    this.cancelAction.emit(true)
  }

  cancel(){
    this.cancelAction.emit(true)
  }

}
