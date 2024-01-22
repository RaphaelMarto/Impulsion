import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { config } from '../../config/configuration';
import { StatisticData } from './statistic.model'

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit, AfterViewInit {
  @ViewChild('myChart') myChart!: ElementRef;
  options = { withCredentials: true };
  
  public dataObserv!:Observable<StatisticData>;

  constructor(private location: Location,private http: HttpClient) {}

  ngOnInit() {
    this.init()
  }

  ngAfterViewInit() {
    const ctx = this.myChart.nativeElement.getContext('2d');

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Views Evolution',
          data: [65, 59, 80, 90, 56, 55, 40],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)',
          ],
          borderWidth: 1,
        },
      ],
    };

    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    })
  }

  goBack() {
    this.location.back();
  }

  init(){
    this.dataObserv = this.http.get<StatisticData>(config.API_URL + '/statistic/user', this.options);
  }
}
