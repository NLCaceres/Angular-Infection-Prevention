import { Employee } from "./Employee";
import { HealthPractice } from "./HealthPractice";

export type Report = {
  id?: string;
  employee: Employee;
  healthPractice: HealthPractice;
  location: Location;
  date: Date;
};
