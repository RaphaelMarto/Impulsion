import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { config } from '../../config/configuration';
import { insturmentValidator } from './Validator';

@Component({
  selector: 'app-instrument-form',
  templateUrl: './instrument-form.component.html',
  styleUrls: ['./instrument-form.component.scss'],
})
export class InstrumentFormComponent  implements OnInit {
  InstrumentForm!:FormGroup;
  options = { withCredentials: true };
  InstrumentList:Array<any> = [];

  constructor(private modalCtrl: ModalController,private formBuilder: FormBuilder,private http: HttpClient,public alertController: AlertController) { }

  ngOnInit() {
    this.http.get(config.API_URL + '/user/instrument/all',this.options).subscribe((res:any) => {
      this.InstrumentList = res.map((item:any) => item.Name);
      this.InstrumentForm = this.formBuilder.group({
        name: ['', [Validators.required, insturmentValidator(this.InstrumentList)]],
        reference: [''],
      });
    })

    this.InstrumentForm ??= this.formBuilder.group({
      name: ['', []],
      reference: [''],
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  SendInstrument(){
    if(this.InstrumentForm.valid){
      this.http.post(config.API_URL + '/music/instrumentTemp/new', this.InstrumentForm.value ,this.options).subscribe(() => {
        this.ConfirmSent()
      })
    }
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
