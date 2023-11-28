import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GoogleSheetService } from '../google-sheet.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isNavbarCollapsed = true;

  titleTab!: string;
  titleHead!: string;
  logoUrl!: string;
  pages: any[] = []; // Define the type based on your data structure

  constructor(private titleService: Title, private googleSheetService: GoogleSheetService) {  }

  ngOnInit() {
    const siteData = this.googleSheetService.getSheet('site');
    this.logoUrl = (siteData[0].logo == '') ? '' : `assets/images/${siteData[0].logo}`;

    // Set Tab Name and Title dynamically
    this.titleTab = siteData[0].titleTab;
    this.titleService.setTitle(this.titleTab.toUpperCase());
    this.titleHead = siteData[0].titleHeader;
    
    this.pages = siteData.filter(page => page.active.toLowerCase() === 'true' && page.page.toLowerCase() !== 'home' );
  }

}

