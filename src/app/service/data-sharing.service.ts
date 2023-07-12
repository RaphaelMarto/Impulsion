import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  private data = new BehaviorSubject<boolean>(true);
  private dataTab = new BehaviorSubject<boolean>(false);

  getData() {
    return this.data.asObservable();
  }

  setData(data: boolean) {
    this.data.next(data);
  }

  getDataTab() {
    return this.dataTab.asObservable();
  }

  setDataTab(data: boolean) {
    this.dataTab.next(data);
  }
}
