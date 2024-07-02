export type Profession = {
  _id?: string; // - Not actually optional, just no ID until the server sets it
  observedOccupation: string;
  serviceDiscipline: string;
};
