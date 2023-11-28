import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GoogleSheetService } from '../google-sheet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit{
  private emailData: any[] = [];
  showModal: boolean = false;

  constructor(private gsService: GoogleSheetService, private router: Router ) {};

  ngOnInit(): void {
    this.emailData = this.gsService.getSheet('mail');
    // console.log(this.emailData);
  }

  onSubmit(form: NgForm) {
    const formValue = form.value;
    const emailExists = this.emailData.some(row => row.email === formValue.emailAddress);

    if (!emailExists) {
      this.gsService.appendData(formValue).subscribe({
        next: (data) => {
          console.log('Request successful', data);
          this.emailData.push(formValue);
        },
        error: (error) => {
          console.error('Request failed', error);
        }
      });
    } else {
      console.warn('Email already exists in the sheet');
    }

    form.reset();

    this.showModal = true;
  }

  handleModalClose() {
    this.showModal = false;
    this.router.navigate(['/']); // Navigate to home
  }

}
