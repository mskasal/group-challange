import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Week } from "../../models/calendar.model";

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  private weeks: Week[] = [];
  private week: Subject<Week> = new Subject();

  public week$ = this.week.asObservable();

  constructor() {
    this.generateWeeks(2022);
  }

  private generateWeeks(year: number): void {
    const januaryFirst = new Date(year, 0, 1);
    const firstDayOfWeek = 1;

    for (let i = 0; i < 52; i++) {
      let startDate = new Date(januaryFirst);
      startDate.setDate(
        startDate.getDate() + (i * 7) - startDate.getDay() + firstDayOfWeek,
      );

      if (startDate.getDay() !== 1) {
        continue;
      }

      let endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 4);

      this.weeks.push({
        index: i + 1,
        startDate: new Date(startDate).getTime() / 1000,
        endDate: new Date(endDate).getTime() / 1000,
      });
    }
  }

  setWeek(weekNumber: number) {
    const selectedWeek = this.weeks.find((week) => week.index === weekNumber);
    this.week.next(selectedWeek!);
  }
}
