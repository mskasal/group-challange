import { Injectable } from "@angular/core";
import { RestService } from "../rest/rest.service";
import { BehaviorSubject, Observable } from "rxjs";
import { Note, NoteLabel } from "../../models/note.model";

@Injectable()
export class NotesService {
  private notesSubject = new BehaviorSubject<Note[]>([]);
  private filteredNotesSubject = new BehaviorSubject<Note[]>([]);
  private noteLabelsSubject = new BehaviorSubject<NoteLabel[]>([]);
  private labelFilter: number[] = [];

  public notes$: Observable<Note[]> = this.notesSubject.asObservable();
  public labels$: Observable<NoteLabel[]> = this.noteLabelsSubject
    .asObservable();
  public filteredNotes$: Observable<Note[]> = this.filteredNotesSubject
    .asObservable();

  constructor(private restService: RestService) {
    this.fetchNotes();
    this.fetchLabels();
  }

  fetchNotes(): void {
    this.restService.getNotes().subscribe((notes) => {
      this.notesSubject.next(notes);
      this.filteredNotesSubject.next(notes);
    });
  }

  fetchLabels(): void {
    this.restService.getNoteLabels().subscribe((labels) => {
      this.noteLabelsSubject.next(labels);
    });
  }

  setLabelFilter(labelIds: number[]): void {
    this.labelFilter = labelIds;
    this.filterNotes();
  }

  private filterNotes(): void {
    const notes = this.notesSubject.getValue();
    const filteredNotes = this.filterByLabel(notes);
    this.filteredNotesSubject.next(filteredNotes);
  }

  private filterByLabel(notes: Note[]): Note[] {
    if (this.labelFilter.length === 0) {
      return notes;
    } else {
      return notes.filter((note) =>
        this.isExistInArray(note.labels, this.labelFilter)
      );
    }
  }

  private isExistInArray(
    targetArray: number[],
    filterArray: number[],
  ): boolean {
    for (let i = 0; i < targetArray.length; i++) {
      if (filterArray.includes(targetArray[i])) {
        return true;
      }
    }

    return false;
  }
}
