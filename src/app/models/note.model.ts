export interface NotePreview {
  id: number;
  title: string;
  summary?: string;
  labels: number[];
  startDate: number;
  endDate: number;
}

export interface Note extends NotePreview {
  weeks: number[];
  daysOfWeek: number[];
  friendlyDate: string;
  duration: string;
}

export interface NotesByLabel {
  [labelId: number]: Note[];
}
