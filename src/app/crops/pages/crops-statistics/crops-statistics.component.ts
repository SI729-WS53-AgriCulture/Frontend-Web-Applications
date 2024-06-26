import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Component, OnInit, ViewChild } from "@angular/core";
import { NgApexchartsModule } from "ng-apexcharts";
import { ChartComponent, ApexNonAxisChartSeries, ApexResponsive, ApexChart } from "ng-apexcharts";
import { MatCardModule } from '@angular/material/card';
import { SowingsService } from "../../services/sowings.service"; // Importa SowingsService
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TemplateRef } from '@angular/core';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-crops-statistics',
  templateUrl: './crops-statistics.component.html',
  styleUrls: ['./crops-statistics.component.css']
})
export class CropsStatisticsComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  @ViewChild('registeredCropDialog') registeredCropDialog!: TemplateRef<any>;
  @ViewChild('controlledCropDialog') controlledCropDialog!: TemplateRef<any>;
  public chartOptions: Partial<ChartOptions>;
  public controlChartOptions: Partial<ChartOptions>;
  public mostRegisteredCrop: string = '';
  public mostControlledCrop: string = '';

  constructor(private sowingsService: SowingsService, public dialog: MatDialog) {
    this.chartOptions = {
      series: [],
      chart: {
        width: 500,
        type: "pie"
      },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };


    this.controlChartOptions = {
      series: [],
      chart: {
        width: 500,
        type: "pie"
      },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  private getAllControls() {
  this.sowingsService.getAll().subscribe((response: any) => {

    if (response) {
      const counts = response.reduce((acc: { [key: string]: number }, sowing: any) => {
        acc[sowing.crop_name] = (acc[sowing.crop_name] || 0) + sowing.controls.length;
        return acc;
      }, {});


      this.controlChartOptions.labels = Object.keys(counts);
      this.controlChartOptions.series = Object.values(counts);

      let maxCount = Math.max(...this.controlChartOptions.series);
      let index = this.controlChartOptions.series.indexOf(maxCount);
      this.mostControlledCrop = this.controlChartOptions.labels[index];
    }
  });
};

private getAllCrops() {
  this.sowingsService.getAll().subscribe((response: any) => {

    if (response) {
      const counts = response.reduce((acc: { [key: string]: number }, sowing: any) => {
        acc[sowing.crop_name] = (acc[sowing.crop_name] || 0) + 1;
        return acc;
      }, {});


      this.chartOptions.labels = Object.keys(counts);
      this.chartOptions.series = Object.values(counts);

      let maxCount = Math.max(...this.chartOptions.series);
      let index = this.chartOptions.series.indexOf(maxCount);
      this.mostRegisteredCrop = this.chartOptions.labels[index];
      }
  });
};
  ngOnInit() {
    this.getAllControls();
    this.getAllCrops();
  }

 openDialog(): void {
     this.dialog.open(this.registeredCropDialog, {
       data: {
         crop: this.mostRegisteredCrop
       }
     });
   }

 openControlledCropDialog(): void {
     this.dialog.open(this.controlledCropDialog, {
       data: {
         crop: this.mostControlledCrop
       }
     });
   }
}

@NgModule({
  declarations: [CropsStatisticsComponent],
  imports: [BrowserModule, NgApexchartsModule, MatCardModule,MatDialogModule],
  providers: [SowingsService],
  bootstrap: [CropsStatisticsComponent]
})
export class AppModule { }
