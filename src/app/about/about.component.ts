import { Component, OnInit } from '@angular/core';
import { GoogleSheetService } from '../google-sheet.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit{
  public aboutItems: any[] = [];

  constructor(private googleSheetService: GoogleSheetService) { }

  ngOnInit() {
    const aboutData = this.googleSheetService.getSheet('about');
    this.aboutItems = [];

    for (const item of aboutData) {

      if (item.active.toLowerCase() === 'true') {
        this.aboutItems.push({
          name: item.name,
          instrument: item.instrument,
          image: item.image.startsWith('http') ? fix_url(item.image) : 'assets/images/about/' + item.image,
          active: item.active,
          email: item.email,
          notes: item.notes
        });
      }

    }
  }

  
}
function fix_url(str:string) {
  if(str.substring(0,4) == 'http') return str.replace('file/d/', 'uc?id=').split('/view?')[0];
  else return `./images/${str}`
}
