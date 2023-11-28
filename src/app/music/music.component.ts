import { Component, OnInit } from '@angular/core';
import { GoogleSheetService } from '../google-sheet.service';
import { DomSanitizer } from '@angular/platform-browser';

interface SocialLink {
  name: string;
  serviceType: string;
  url: string;
}

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss']
})
export class MusicComponent implements OnInit {
  public musicData: any =[];
  socials: SocialLink[] = [];

  constructor(private gsService: GoogleSheetService, private sanitizer: DomSanitizer) {}

  convertDriveUrl(driveUrl: string): string {
    if (driveUrl.includes('drive.google.com')) {
      const fileIdMatch = driveUrl.match(/[-\w]{25,}/);
      const fileId = fileIdMatch ? fileIdMatch[0] : null;
  
      if (!fileId) {
        console.error('Invalid Google Drive URL');
        return 'assets/images/music/default.png';
      }
  
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    } else {
      return driveUrl; // NOT a Google Drive URL
    }
  }

  isExternalUrl(url: string): boolean {
    // Looks for match of a typical external URL; checks for "http://", "https://", "//" (protocol-relative URL) or "www."
    const externalUrlPattern = /^(http:\/\/|https:\/\/|\/\/|www\.).*/;
    return externalUrlPattern.test(url);
  }
  
  
  preprocessMusicData(musicData: any[]): void {
    musicData.forEach(music => {
      // Convert Google Drive URLs to useful URLs
      if (music.image && this.isExternalUrl(music.image)) {
        music.directImageUrl = this.convertDriveUrl(music.image);
      } else {
        music.directImageUrl = `assets/images/music/${music.image}`;
      }

      if (music.audio && this.isExternalUrl(music.audio)) {
        music.directAudioLink = this.convertDriveUrl(music.audio);
      } else {
        music.directAudioLink = `assets/music/${music.audio}`;
      }

      if(music.spotify) {
        music.safeSpotifyHtml = this.sanitizer.bypassSecurityTrustHtml(music.spotify);
      }

      if(music.appleMusic) {
        let am = music.appleMusic.replace('175', '190');
        music.safeAppleHtml = this.sanitizer.bypassSecurityTrustHtml(am); // adjusts for slider
      }
    });
  }  
  
  ngOnInit(): void {
    this.musicData = this.gsService.getSheet('music');
    this.preprocessMusicData(this.musicData);

    const aboutData = this.gsService.getSheet('about');
    const musicServiceData: Record<string, any>[] = aboutData
      .filter(row => row.socials && row.socialUrl);
    
    this.socials = musicServiceData.map((row: Record<string, any>) => {
      const name = row['socials'];
      const serviceType = row['serviceType'];
      const url = row['socialUrl'];
      return { name, serviceType, url };
    });
  }

}
