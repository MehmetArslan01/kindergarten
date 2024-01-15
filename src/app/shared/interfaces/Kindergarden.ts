export interface Kindergarden {
    id: number;
    name: string;
    address: string;
    betreiber: string;
    typ: Typ,
  }

export class KindergardenClass implements Kindergarden{
  constructor(public id: number, public name: string, public address: string, public betreiber: string, public typ:Typ) {}
}

export enum Typ {
    privat = 1,
    oeffentlich = 2,
}
