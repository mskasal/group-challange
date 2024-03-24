import { Injectable } from "@angular/core";
import { RestService } from "../rest/rest.service";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Note, NotePreview } from "../../models/note.model";
import { CalendarService } from "../calendar/calendar.service";
import { Week } from "../../models/calendar.model";
import { Label } from "../../models/label.model";
import { DateService } from "../date/date.service";

@Injectable()
export class NotesService {
  private notesSubject = new BehaviorSubject<Note[]>([]);
  private filteredNotesSubject = new BehaviorSubject<Note[]>([]);
  private noteLabelsSubject = new BehaviorSubject<Label[]>([]);
  private weekSubject = new Subject<Week>();
  private labelFilter: number[] = [];
  private weekFilter: number = 0;

  private notes$: Observable<Note[]> = this.notesSubject.asObservable();
  public labels$: Observable<Label[]> = this.noteLabelsSubject
    .asObservable();
  public filteredNotes$: Observable<Note[]> = this.filteredNotesSubject
    .asObservable();
  public week$: Observable<Week> = this.weekSubject.asObservable();

  constructor(
    private restService: RestService,
    private calendarService: CalendarService,
    private dateService: DateService,
  ) {
    this.fetchNotes();
    this.fetchLabels();
    this.fetchWeek();
  }

  fetchWeek(): void {
    this.calendarService.week$.subscribe((week) => {
      console.log(week, "i nservice");
      this.weekSubject.next(week);
      this.weekFilter = week.index;
    });
  }

  fetchNotes(): void {
    this.restService.getNotes().subscribe((notes) => {
      const workedNotes = notes.map((note: NotePreview, _) => {
        return {
          ...note,
          duration: this.dateService.findDuration(note.startDate, note.endDate),
          friendlyDate: this.dateService.findFriendlyDate(note.startDate),
          weeks: this.dateService.findWeeksOfDateRange(
            note.startDate,
            note.endDate,
          ),
        } as Note;
      });
      this.notesSubject.next(workedNotes);
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

  setCalendarWeek(week: number): void {
    this.calendarService.setWeek(week);
    this.filterNotes();
  }

  private filterNotes(): void {
    const notes = this.notesSubject.getValue();
    const filteredByLabel = this.filterByLabel(notes);
    const filteredByWeek = this.filterByWeekDay(filteredByLabel);
    console.log(filteredByWeek);
    this.filteredNotesSubject.next(filteredByWeek);
  }

  private filterByLabel(notes: Note[]): Note[] {
    if (this.labelFilter.length !== 0) {
      return notes.filter((note) =>
        this.isExistInArray(note.labels, this.labelFilter)
      );
    }
    return notes;
  }

  private filterByWeekDay(notes: Note[]): Note[] {
    if (this.weekFilter !== 0) {
      console.log(
        this.weekFilter,
        "filterByWeekDay",
      );
      return notes.filter((note) => note.weeks.includes(this.weekFilter)).map(
        (note) => {
          return {
            ...note,
            daysOfWeek: this.dateService.findDaysOfWeek(
              note.startDate,
              note.endDate,
              this.weekFilter,
            ),
          } as Note;
        },
      );
    }

    return notes;
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

  private isExistInTimeRange(
    startDate: number,
    endDate: number,
    rangeStarts: number,
    rangeEnds: number,
  ): boolean {
    console.log(startDate >= rangeStarts, startDate, rangeStarts);
    if (startDate >= rangeStarts) {
      return true;
    }

    console.log(
      rangeStarts >= startDate && rangeEnds >= endDate,
      startDate,
      endDate,
      rangeStarts,
      rangeEnds,
    );
    if (rangeStarts >= startDate && rangeEnds >= endDate) {
      return true;
    }

    return false;
  }
}
