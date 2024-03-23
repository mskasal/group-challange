export interface Note {
  id: number;
  title: string;
  summary?: string;
  labels: number[];
  startDate: number;
  endDate: number;
}

export interface NoteLabel {
  id: number;
  text: string;
}


