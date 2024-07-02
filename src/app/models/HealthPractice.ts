import { Precaution } from "./Precaution";

export type HealthPractice = {
  name: string;
  precaution: Precaution; // - The type of Precaution this HealthPractice is
};