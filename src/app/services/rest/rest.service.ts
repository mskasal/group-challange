import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Note } from "../../models/note.model";
import { Label } from "../../models/label.model";

@Injectable({
  providedIn: "root",
})
export class RestService {
  private apiUrl = "https://65aa53a0081bd82e1d96ab45.mockapi.io/pinguin/api/";

  constructor(private http: HttpClient) {}

  getNotes() {
    return this.http.get<Note[]>(`${this.apiUrl}/notes`);
  }

  getNoteLabels() {
    return this.http.get<Label[]>(`${this.apiUrl}/noteLabels`);
  }
}
