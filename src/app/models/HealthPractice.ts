import { Precaution } from "./Precaution";

export type HealthPractice = {
  id?: string;
  name: string;
  precaution: Precaution; // - The type of Precaution this HealthPractice is
};