import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BackendService } from 'src/app/shared/backend.service';
import { CHILDREN_PER_PAGE } from 'src/app/shared/constants';
import { StoreService } from 'src/app/shared/store.service';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  @Input() currentPage!: number;
  @Output() selectPageEvent = new EventEmitter<number>();
  public page: number = 0;
  public showToast = false;
  public selectedKindergarten: string | null = null;
  public sortOptions = {
    field: 'name',
    order: 'asc',
  };


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public storeService: StoreService, private backendService: BackendService) {}

  public showCancellationConfirmationFlag = false; 
  public childIdForCancellation: string | null = null;

 public sortChildren(field: string) {
  if (this.sortOptions.field === field) {
    this.sortOptions.order = this.sortOptions.order === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortOptions.field = field;
    this.sortOptions.order = 'asc';
  }

  this.storeService.children.sort((a, b) => {
    const valueA = (a as any)[field];
    const valueB = (b as any)[field];
    const order = this.sortOptions.order === 'asc' ? 1 : -1;

    if (valueA < valueB) {
      return -1 * order;
    } else if (valueA > valueB) {
      return 1 * order;
    } else {
      return 0;
    }
  });
}
  
  public sortChildrenByRegistrationDate() {
    this.sortChildren('registrationDate');
  }

 filterChildrenByKindergarten() {
    console.log('Filtering children by kindergarten...');
    if (this.selectedKindergarten && this.selectedKindergarten != "alle") {
      const selectedKindergartenId = this.getKindergartenIdByName(this.selectedKindergarten);
      if (selectedKindergartenId !== null) {
        console.log('Selected Kindergarten Id:', selectedKindergartenId);
        this.backendService.getChildren(this.currentPage, CHILDREN_PER_PAGE, selectedKindergartenId);
      } else {
        console.error(`Kindergarten "${this.selectedKindergarten}" not found.`);
      }
    } else {
      console.log('Fetching all children...');
      this.backendService.getChildren(this.currentPage);
    }
  }

  private getKindergartenIdByName(kindergartenName: string): number | null {
    const selectedKindergarten = this.storeService.kindergardens.find(kg => kg.name === kindergartenName);
    return selectedKindergarten ? selectedKindergarten.id : null;
  }
  showCancellationConfirmation(childId: string) {
    this.childIdForCancellation = childId;
    this.showCancellationConfirmationFlag = true; 
  }

  cancelCancellation() {
    this.showCancellationConfirmationFlag = false;
    this.childIdForCancellation = null;
  }

  confirmChildCancellation() {
    if (this.childIdForCancellation) {
      this.showCancellationConfirmationFlag = false;
      this.childIdForCancellation = null;
    }
  }
  ngOnInit(): void {
    this.backendService.getChildren(this.currentPage);
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe((event) => {
      this.selectPage(event.pageIndex + 1);
    });
  }

  getAge(birthDate: string) {
    var today = new Date();
    var birthDateTimestamp = new Date(birthDate);
    var age = today.getFullYear() - birthDateTimestamp.getFullYear();
    var m = today.getMonth() - birthDateTimestamp.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateTimestamp.getDate())) {
      age--;
    }
    return age;
  }

  selectPage(i: any) {
    let currentPage = i;
    this.selectPageEvent.emit(currentPage);
    this.backendService.getChildren(currentPage);
  }

  public returnAllPages() {
    let res = [];
    const pageCount = Math.ceil(this.storeService.childrenTotalCount / CHILDREN_PER_PAGE);
    for (let i = 0; i < pageCount; i++) {
      res.push(i + 1);
    }
    return res;
  }

  public cancelRegistration(childId: string) {
    this.backendService.deleteChildData(childId, this.currentPage);
    this.backendService.getChildren(this.currentPage);
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  
}
