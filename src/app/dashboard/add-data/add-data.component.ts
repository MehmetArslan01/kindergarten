import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
      birthDate: [null, [Validators.required, this.dateValidator.bind(this)]]
    });
  }

  dateValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = control.value;
    if (selectedDate) {
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 10); 
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() - 3); 

      if (selectedDate < minDate || selectedDate > maxDate) {
        return { invalidDate: true, message: 'Kind should be between 3 and 10 years old.' };
      }
    }

    return null;
  }

  onSubmit() {
    if (this.addChildForm.valid) {
      this.addChildForm.value.registrationDate = new Date(), 
      this.backendService.addChildData(this.addChildForm.value, this.currentPage);
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    }
  }

  setErrorMessages(controlName: string, errorMessages: { [key: string]: string }): void {
    const control = this.addChildForm.get(controlName);
    if (control) {
      control.setErrors(errorMessages);
    }
  }
}
