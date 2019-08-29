export class Profession {
  _id: string;
  observed_occupation: string;
  service_discipline: string;

  constructor(observed_occupation: string, service_discipline: string) {
    this.observed_occupation = observed_occupation;
    this.service_discipline = service_discipline;
  }
}
