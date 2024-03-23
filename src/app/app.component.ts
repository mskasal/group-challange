import { Component } from "@angular/core";
import { NotesService } from "./services/notes/notes.service";
import { Observable } from "rxjs";
import { Note, NoteLabel } from "./models/note.model";
import { MatSelectChange } from "@angular/material/select";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  providers: [NotesService],
})
export class AppComponent {
  title = "e-group-challange";
  notes$: Observable<Note[]> = new Observable();
  labels$: Observable<NoteLabel[]> = new Observable();
  selectedLabel: number = -1;
  filterFormControl= new FormControl();

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    this.notes$ = this.notesService.filteredNotes$;
    this.labels$ = this.notesService.labels$;
  }

  filterLabelChanged(event: MatSelectChange) {
    const labelId = event.value;
    this.notesService.setLabelFilter(labelId);
  }
}
