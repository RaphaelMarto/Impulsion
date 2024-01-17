import { Component, OnInit } from '@angular/core';
import { TabsProfilService } from './service/tabs-profil.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { Observable, of } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tabs-profil-component',
  templateUrl: './tabs-profil-component.component.html',
  styleUrls: ['./tabs-profil-component.component.scss'],
})
export class TabsProfilComponentComponent implements OnInit {
  public activeTab: string = 'music';
  public musicObserv!: Observable<any[]>;
  public followObserv!: Observable<any[]>;

  constructor(private dataSharingService: DataSharingService,private tabsProfilService: TabsProfilService, public alertController: AlertController) {}

  ngOnInit() {
    this.refresh();
    this.dataSharingService.getDataTab().subscribe((val) => {
      if (!val) {
        this.refresh();
      } 
    })
  }

  refresh() {
    this.loadInitialMusicData();
    this.loadInitialFollowData();
  }

  loadInitialMusicData(): void {
    this.tabsProfilService.getAllMusicUser().subscribe((musicData: any) => {
      this.musicObserv = of(musicData);
    });
  }

  loadInitialFollowData(): void {
    this.tabsProfilService.getAllFollow().subscribe((data: any) => {
      this.followObserv = of(data);
    });
  }

  deleteMusic(id: number): void {
    this.tabsProfilService.deleteMusic(id).subscribe(() => {
      this.loadInitialMusicData();
    });
  }

  deleteFollow(id: any): void {
    this.tabsProfilService.deleteFollow(id).subscribe(() => {
      this.loadInitialFollowData();
    });
  }

  async MusicDeleteConfirm(id:number) {
    const alert = await this.alertController.create({
      header: 'Confirm deletion?',
      message: 'Are you sure you want to delete your music ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'medium',
        },
        {
          text: 'Delete',
          role: 'confirm',
          cssClass: 'alert-button-delete',
          handler: () => {
            this.deleteMusic(id)
          },
        },
      ]
    });

    await alert.present();
  }

  async FollowDeleteConfirm(id:number) {
    const alert = await this.alertController.create({
      header: 'Confirm unfollow?',
      message: 'Are you sure you want to unfollow ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'medium',
        },
        {
          text: 'Delete',
          role: 'confirm',
          cssClass: 'alert-button-delete',
          handler: () => {
            this.deleteFollow(id)
          },
        },
      ]
    });

    await alert.present();
  }
}
