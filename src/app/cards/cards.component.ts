import { Component, OnInit } from '@angular/core';
import { GoogleSheetService } from '../google-sheet.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit{
  public cardItems: any[] = [];

  constructor(private googleSheetService: GoogleSheetService) { }

  ngOnInit() {
    const siteData = this.googleSheetService.getSheet('site');

    this.cardItems = [];
    for (const item of siteData) {
      if (item.active.toLowerCase() === 'true' && item.page.toLowerCase() !== 'home') {
        this.cardItems.push({
          thumbnail: (item.thumbnail.startsWith('http')) ? item.thumbnail : 'assets/images/site/'+item.thumbnail,
          page: item.page,
          subhead: item.subhead
        });
      }
    }
  }
}
