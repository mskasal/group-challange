import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Label } from "../../models/label.model";
import { RestService } from "../rest/rest.service";

@Injectable({
  providedIn: "root",
})
export class LabelsService {
  private labelsSubject: BehaviorSubject<Label[]> = new BehaviorSubject(
    [] as Label[],
  );
  private filterSubject: BehaviorSubject<number[]> = new BehaviorSubject(
    [] as number[],
  );

  public labels$: Observable<Label[]> = this.labelsSubject.asObservable();
  public filter$: Observable<number[]> = this.filterSubject.asObservable();

  constructor(private restService: RestService) {
    this.fetchLabels();
  }

  fetchLabels() {
    this.restService.getNoteLabels().subscribe((labels) => {
      this.labelsSubject.next(labels);
    });
  }

  setFilters(labelIds: number[] = []) {
    this.filterSubject.next(labelIds);
  }
}
