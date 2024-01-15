import { Kindergarden } from "./Kindergarden";

export interface Child {
    registrationDate: string;
    id: string;
    name: string;
    birthDate: string,
    kindergardenId: number
  }

  export interface ChildResponse {
    id: string;
    name: string;
    birthDate: string,
    registrationDate: string; 
    kindergarden: Kindergarden,
    kindergardenId: number
  }