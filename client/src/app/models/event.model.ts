export interface Event {
  id: string;
  name: string;
  description: string;
  startDatetime: string; // ISO 8601 format
  endDatetime?: string; // ISO 8601 format, optional
}
