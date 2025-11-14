export interface Animal {
  name: string;
  id: string;
  shelterId: string;
  type: 'Cat' | 'Dog';
  dateOfIntake: string; // YYYY-MM-DD
  dateOfBirth?: string;
  notes?: string;
}