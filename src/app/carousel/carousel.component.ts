import { Component, OnInit } from '@angular/core';
import { GoogleSheetService } from '../google-sheet.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  carouselItems: any = [];

  constructor(private googleSheetService: GoogleSheetService) {  }

  isInternalLink(link: string): boolean {
    return link.startsWith('/');
  }

  ngOnInit(){
    const homeData = this.googleSheetService.getSheet('home')!;
    
    // Currently this will find either: 
    //    carouselImages url directly or
    //    localUrl which will pick the right size Sm, Md, or Lg.
    //    It will NOT find an image named after the localUrl.
    //    This is designed so that anyone can add a url to the first col and when time allows they can be resized and brought locally.
    this.carouselItems = homeData.map(item => {
      return Object.keys(item).reduce((accumulator: { [key: string]: any }, key) => {
        const basePath = 'assets/images/carousel/';
    
        if (key === 'carouselImages') {
          let imagePath = item[key];
          // console.log('Original imagePath = ' + imagePath);
    
          if (item['localUrl']) {
            let [fileName, fileExtension] = item['localUrl'].split('.');
            let localPath = `${basePath}${fileName}`;
            // console.log('New imagePath = ' + localPath);
    
            accumulator['imageSrcSet'] = `${localPath}Sm.${fileExtension} 576w, ${localPath}Md.${fileExtension} 768w, ${localPath}Lg.${fileExtension} 1200w`;
            accumulator['imageSizes'] = `(max-width: 575px) 540px, (max-width: 767px) 720px, (max-width: 991px) 960px, 1140px`;
          } else {
            accumulator['imageSrcSet'] = `${imagePath} 1200w`;
            accumulator['imageSizes'] = `100vw`;
          }
    
          accumulator['carouselImage'] = `${basePath}${imagePath}`;
        } else {
          accumulator[key] = item[key];
        }
    
        return accumulator;
      }, {});
    });
        
    // console.log(this.carouselItems);
  }
}

