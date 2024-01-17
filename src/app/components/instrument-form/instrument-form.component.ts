import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { config } from '../../config/configuration';

@Component({
  selector: 'app-instrument-form',
  templateUrl: './instrument-form.component.html',
  styleUrls: ['./instrument-form.component.scss'],
})
export class InstrumentFormComponent  implements OnInit {
  InsturmentForm:any;

  constructor(private modalCtrl: ModalController,private formBuilder: FormBuilder,private http: HttpClient,public alertController: AlertController) { }

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
      this.ConfirmSent()
    })
  }

  async ConfirmSent() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Your request has been sent !',
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          cssClass: 'alert-button-delete',
          handler: () => {
            this.modalCtrl.dismiss(null, 'cancel');
          },
        },
      ]
    });

    await alert.present();
  }

}
