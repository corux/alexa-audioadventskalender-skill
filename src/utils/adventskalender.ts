import { DateTime } from "luxon";
import * as data from "../data/data.json";

export function getRemainingDays() {
  const decemberFirst = DateTime.local(DateTime.local().year, 12, 1);
  const diff = decemberFirst.diffNow("days").days;
  return Math.floor(diff);
}

export function getAdventskalender(date: DateTime): ({
  audioUrl: string,
  imageUrl: string,
  title: string,
}) {
  console.log(data);
  return data[date.day];
}
