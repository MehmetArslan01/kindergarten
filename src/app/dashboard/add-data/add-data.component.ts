import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
      birthDate: [null, [Validators.required, Validators.min(this.calculateMinAge()), Validators.max(this.calculateMaxAge())]]
    });
  }

  calculateMinAge(): number {
    const today = new Date();
    return today.getFullYear() - 10; 
  }

  calculateMaxAge(): number {
    const today = new Date();
    return today.getFullYear() - 3; 
  }

  onSubmit() {
    if (this.addChildForm.valid) {
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
