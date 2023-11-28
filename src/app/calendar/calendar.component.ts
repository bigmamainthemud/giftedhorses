import { Component, OnInit } from '@angular/core';
import { GoogleSheetService } from '../google-sheet.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  calItems: any = [];

  constructor(private googleSheetService: GoogleSheetService) {  }

  ngOnInit(){
    const homeData = this.googleSheetService.getSheet('calendar');
    
    this.calItems = homeData.map(item => {
      return Object.keys(item).reduce((accumulator: { [key: string]: any }, key) => {
        accumulator[key] = item[key];
    
        return accumulator;
      }, {});
    });

    this.calItems.forEach((item: any) => {
      item.isDatePassed = this.hasDatePassed(item.date);
    });
  }

  hasDatePassed(dateStr: string): boolean {
    let today = new Date();
    today.setHours(0, 0, 0, 0);  // Remove time component
    let itemDate = new Date(dateStr);

    return itemDate < today;
  }

  goToLink(url: string): void {
    window.open(url, '_blank');
  }  

}
