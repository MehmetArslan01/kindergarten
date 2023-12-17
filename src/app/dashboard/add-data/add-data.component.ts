import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { BackendService } from 'src/app/shared/backend.service';
import { StoreService } from 'src/app/shared/store.service';


@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss']
})
export class AddDataComponent implements OnInit {

  constructor(private formbuilder: FormBuilder, public storeService: StoreService, public backendService: BackendService) { }

  public addChildForm: any;
  @Input() currentPage!: number;

  public showToast = false;

  ngOnInit(): void {
    this.addChildForm = this.formbuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      kindergardenId: ['', [Validators.required]],
      birthDate: [null, [Validators.required, this.ageRangeValidator(3, 10)]]
    });
  }

 onSubmit() {
    if (this.addChildForm.valid) {
      this.backendService.addChildData(this.addChildForm.value, this.currentPage);
      this.showToast = true; // Show the Bootstrap Toast
      setTimeout(() => {
        this.showToast = false; // Hide the Toast after a delay (e.g., 3000 milliseconds)
      }, 3000);
    }
  }
  ageRangeValidator(min: number, max: number) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value) {
        const birthDate = new Date(control.value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();

        if (age < min || age > max) {
          return { 'ageRange': true };
        }
      }

      return null;
    };
  }

  setErrorMessages(controlName: string, errorMessages: { [key: string]: string }): void {
    const control = this.addChildForm.get(controlName);
    if (control) {
      control.setErrors(errorMessages);
    }
  }
}
