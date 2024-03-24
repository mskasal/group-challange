import { Injectable } from "@angular/core";
import { differenceInDays, format, getDay, getWeek } from "date-fns";

@Injectable()
export class DateService {
  constructor() {}

  findWeeksOfDateRange(startDate: number, endDate: number): number[] {
    const start = getWeek(new Date(startDate * 1000));
    const end = getWeek(new Date(endDate * 1000));

    return [start, end];
  }

  findDaysOfWeek(
    startDate: number,
    endDate: number,
    currentWeek: number,
  ): number[] {
    const startWeek = getWeek(new Date(startDate * 1000));
    const endWeek = getWeek(new Date(endDate * 1000));

    const startDay = getDay(new Date(startDate * 1000));
    const endDay = getDay(new Date(endDate * 1000));

    if (currentWeek === startWeek && startWeek === endWeek) {
      return [startDay, endDay];
    }

    if (currentWeek === startWeek && endWeek > startWeek) {
      return [startDay, 5];
    }

    if (currentWeek > startWeek && currentWeek === endWeek) {
      return [1, endDay];
    }

    if (currentWeek > startWeek && endWeek > currentWeek) {
      return [1, 5];
    }

    return [0, 0];
  }

  findDuration(startDate: number, endDate: number): string {
    const durationInDays = differenceInDays(
      new Date(endDate * 1000),
      new Date(startDate * 1000),
    );
    const durationText = durationInDays > 1 ? "days" : "day";

    return `${durationInDays} ${durationText}`;
  }

  findFriendlyDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);

    const formattedDate = format(date, "dd.MM");
    return formattedDate;
  }
}
