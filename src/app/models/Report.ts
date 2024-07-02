import { Employee } from "./Employee";
import { HealthPractice } from "./HealthPractice";

export type Report = {
  employee: Employee;
  healthPractice: HealthPractice;
  location: Location;
  date: Date;
};
