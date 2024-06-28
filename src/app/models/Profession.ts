export type Profession = {
  _id?: string; // Not technically optional BUT it won't have an ID until the server defines it
  observedOccupation: string;
  serviceDiscipline: string;
};
