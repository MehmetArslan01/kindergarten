import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Kindergarden } from './interfaces/Kindergarden';
import { StoreService } from './store.service';
import { Child, ChildResponse } from './interfaces/Child';
import { CHILDREN_PER_PAGE } from './constants';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient, private storeService: StoreService) { }

  public getKindergardens() {
    this.storeService.isLoading = true;
    this.http.get<Kindergarden[]>('http://localhost:5000/kindergardens').subscribe(data => {
      this.storeService.kindergardens = data;
      this.storeService.isLoading = false;

    });
  }

  public getChildrenByKindergarten(page: number, kindergartenName: string) {
    const url = `http://localhost:5000/childs?_expand=kindergarden&kindergarden.name=${kindergartenName}&_page=${page}&_limit=${CHILDREN_PER_PAGE}`;
    
    this.http.get<ChildResponse[]>(url, { observe: 'response' }).subscribe(data => {
      this.storeService.children = data.body!;
      this.storeService.childrenTotalCount = Number(data.headers.get('X-Total-Count'));
      this.storeService.isLoading = false;
    });
  }

  public getChildren(page: number, childrenPerPage: number = CHILDREN_PER_PAGE, kindergardenId: number | null = null, sortField: string = 'name', sortOrder: string = 'asc') {
    this.storeService.isLoading = true;
    let url = `http://localhost:5000/childs?_expand=kindergarden&_page=${page}&_limit=${childrenPerPage}`;
    if (kindergardenId !== null) {
      url += `&kindergardenId=${encodeURIComponent(kindergardenId)}`;
    }
    url += `&_sort=${sortField}&_order=${sortOrder}`;
    this.http.get<ChildResponse[]>(url, { observe: 'response' }).subscribe(data => {
      this.storeService.children = data.body!;
      this.storeService.childrenTotalCount = Number(data.headers.get('X-Total-Count'));
      this.storeService.isLoading = false;
    });
  }

  public addChildData(child: Child, page:  number) {
    this.http.post('http://localhost:5000/childs', child).subscribe(_ => {
      this.getChildren(page);
    });
  }
  

  public deleteChildData(childId: string, page: number) {
    this.storeService.isLoading = true;
    this.http.delete(`http://localhost:5000/childs/${childId}`).subscribe(_ => {
      this.getChildren(page);
      this.storeService.isLoading = false;

    })
  }
}
