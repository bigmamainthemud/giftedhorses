import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { GoogleSheetService } from './google-sheet.service';
import { HeaderComponent } from './header/header.component';
import { AboutComponent } from './about/about.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MusicComponent } from './music/music.component';
import { HomeComponent } from './home/home.component';
import { CarouselComponent } from './carousel/carousel.component';
import { FooterComponent } from './footer/footer.component';
import { CardsComponent } from './cards/cards.component';
import { SignupComponent } from './signup/signup.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'music', component: MusicComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'signup', component: SignupComponent },
  
  // { path: '**', component: NotFoundComponent } // for handling 404 errors
];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'top'
};



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AboutComponent,
    CalendarComponent,
    MusicComponent,
    HomeComponent,
    CarouselComponent,
    FooterComponent,
    CardsComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {
      ...routerOptions,
      initialNavigation: 'enabledBlocking'
    }),
    MdbCarouselModule,
    FormsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [GoogleSheetService]
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  // constructor() { }
}

export function appInitializerFn(googleSheetService: GoogleSheetService) {
  return () => {

    const spreadsheetID = environment.spreadsheetId;
    return new Promise((resolve, reject) => {
      googleSheetService.initData(spreadsheetID, ['NOTES', '$']).subscribe({
        next: (response) => {
          // console.log('Initialization data loaded:', response);
          resolve(response);
        },
        error: (error) => {
          console.error('Error during app initialization:', error);
          reject(error);
        }
      });
    });
    
  };
}


