export interface AdherenceRecord {
  timestamp: number;
  adherenceRate: number;
  [key: string]: any; // Allow for other dynamic columns
}
