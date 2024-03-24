import { Component } from "@angular/core";
import { NotesService } from "./services/notes/notes.service";
import { Observable } from "rxjs";
import { Note } from "./models/note.model";
import { MatSelectChange } from "@angular/material/select";
import { FormControl } from "@angular/forms";
import { CalendarService } from "./services/calendar/calendar.service";
import { Week } from "./models/calendar.model";
import { Label } from "./models/label.model";
import { DateService } from "./services/date/date.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  providers: [NotesService, CalendarService, DateService],
})
export class AppComponent {
  title = "e-group-challange";
  weeky = 1;

  notes$: Observable<Note[]> = new Observable();
  labels$: Observable<Label[]> = new Observable();
  week$: Observable<Week> = new Observable();

  selectedLabel: number = -1;
  filterFormControl = new FormControl();

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    this.notes$ = this.notesService.filteredNotes$;
    this.labels$ = this.notesService.labels$;
    this.week$ = this.notesService.week$;
  }

  filterLabelChanged(event: MatSelectChange) {
    const labelId = event.value;
    this.notesService.setLabelFilter(labelId);
  }

  filterWeekNext() {
    this.notesService.setCalendarWeek(++this.weeky);
  }

  filterWeekPrev() {
    this.notesService.setCalendarWeek(--this.weeky);
  }
}
