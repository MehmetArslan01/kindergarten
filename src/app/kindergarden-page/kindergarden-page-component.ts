import {Component} from '@angular/core';
import {StoreService} from 'src/app/shared/store.service';
import {KindergardenClass, Typ} from "../shared/interfaces/Kindergarden";

@Component({
  selector: 'kindergarden-page',
  templateUrl: './kindergarden-page-component.html',
  styleUrls: ['./kindergarden-page-component.scss']
})
export class KindergardenPageComponent {
  constructor(public storeService: StoreService) {}
  selectedKindergarden: KindergardenClass = new KindergardenClass(0,'','','',Typ.oeffentlich);
  showMore: boolean = false;


  getType(type: number) {
    switch (type) {
      case Typ.privat:
        return 'Privat';
      case Typ.oeffentlich:
        return 'Öffentlich';
      default:
        return 'Nicht angegeben';
    }
  }
  showMoreDetails(id: number) {
    let kindergardenDetails = this.storeService.kindergardens.find( o => o.id === id);
    if (kindergardenDetails) {
      this.selectedKindergarden = kindergardenDetails;
      this.showMore = true;
    }
  }

  goBack() {
    this.selectedKindergarden = new KindergardenClass(0,'','','',Typ.oeffentlich);
    this.showMore = false;
  }

}
