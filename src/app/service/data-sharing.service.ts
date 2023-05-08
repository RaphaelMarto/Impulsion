import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  private data = new Subject<boolean>();

  getData() {
    return this.data.asObservable();
  }

  setData(data: boolean) {
    this.data.next(data);
  }
}
