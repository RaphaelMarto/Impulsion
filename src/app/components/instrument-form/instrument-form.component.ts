import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { config } from '../../config/configuration';

@Component({
  selector: 'app-instrument-form',
  templateUrl: './instrument-form.component.html',
  styleUrls: ['./instrument-form.component.scss'],
})
export class InstrumentFormComponent  implements OnInit {
  InsturmentForm:any;

  constructor(private modalCtrl: ModalController,private formBuilder: FormBuilder,private http: HttpClient) { }

  ngOnInit() {
    this.InsturmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      reference: [''],
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  SendInstrument(){
    const options = { withCredentials: true };
    this.http.post(config.API_URL + '/music/instrumentTemp/new', this.InsturmentForm.value ,options).subscribe(() => {
      this.modalCtrl.dismiss(null, 'cancel');
    })
  }

}
