import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InstrumentFormComponent } from '../instrument-form/instrument-form.component';

@Component({
  selector: 'app-instrument-modal',
  templateUrl: './instrument-modal.component.html',
  styleUrls: ['./instrument-modal.component.scss'],
})
export class InstrumentModalComponent  implements OnInit {
  @Input() instrumentList!: any;
  instrumentsFiltered: any;
  selectedInstrument!: number;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.instrumentsFiltered = this.instrumentList;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(){
    return this.modalCtrl.dismiss(this.selectedInstrument, 'confirm');
  }

  onRadioChange(instrumentId: any) {
    this.selectedInstrument= instrumentId.target.value;
  }

  async viewNewInstrument() {
    this.modalCtrl.dismiss(null, 'cancel');
    const modal = await this.modalCtrl.create({
      component: InstrumentFormComponent,
    });
    await modal.present();
  }

  onSearch(event:any) {
    this.instrumentsFiltered = this.instrumentList.filter((instrument:any) =>
      instrument.Name.toLowerCase().includes(event.target.value.toLowerCase())
    );
  }

}
