import { HealthPractice } from "./HealthPractice";

export type Precaution = {
  name: string;
  healthPractices: HealthPractice[]; // - The HealthPractices that fall under this Precaution type
};