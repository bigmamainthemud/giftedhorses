import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface SheetsData {
  [key: string]: any[];  // Adjust 'any[]' to a more specific type if you can
}

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetService {
  private backendUrl = environment.googleSheetServiceUrl;
  private getPort = this.backendUrl + '/api/data';
  private setPort = this.backendUrl + '/api/append';
  private _data: SheetsData = {};

  constructor(private http: HttpClient) {}

  public initData(ssID: string, exclusions: any = []): Observable<any> {
    return this.http.post<any>(this.getPort, { ssID, exclusions }).pipe(
      tap(data => this._data = data),
      catchError(this.handleError)
    );
  }

  public getSheet(sheetName: string): any[] {
    const sheetData = this._data[sheetName.toLowerCase()];
    if (sheetData) {
      // console.log(sheetData);
      return sheetData;
    } else {
      console.log("This sheet does not exist:", sheetName);
      return [];
    }
  }  

  public appendData(formData: any) {
    console.log('Append Data:');
    console.log(formData);
    return this.http.post(this.setPort, { data: formData });
  }

  // Private
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    throw error;
  }
}