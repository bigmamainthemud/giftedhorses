import { Component, OnInit } from '@angular/core';
import { GoogleSheetService } from '../google-sheet.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  titleHeader!: string;
  emailAddress!: string;
  websiteUrl!: string;
  socials: {name: string, url: string}[] = [];
  
  constructor(private gsService: GoogleSheetService) {}

  ngOnInit() {
    const siteData = this.gsService.getSheet('site');
    this.titleHeader = siteData[0].titleHeader;

    const aboutData = this.gsService.getSheet('about');
    this.websiteUrl = aboutData[0].websiteUrl;
    this.emailAddress = aboutData[0].email;

    const socialData: Record<string, any>[] = aboutData
      .filter(row => row.socials && row.socialUrl);
    
    this.socials = socialData.map((row: Record<string, any>) => {
      const name = row['socials'];
      const url = row['socialUrl'];
      return { name, url };
    });
  }

}
