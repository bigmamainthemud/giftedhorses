import { Component, OnInit } from '@angular/core';
import { GoogleSheetService } from '../google-sheet.service';
import { CarouselComponent } from '../carousel/carousel.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  
  constructor() {  }

  ngOnInit(){
    
  }
}
