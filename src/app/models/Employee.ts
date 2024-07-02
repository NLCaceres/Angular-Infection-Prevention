import { Profession } from "./Profession";

export type Employee = {
  id?: string;
  firstName: string;
  surname: string;
  profession: Profession;
};
