import { addDays } from "date-fns";
export function dateToString(date: Date): string {
  const d = date.toISOString().slice(0, 10);
  return d;
}
export function stringDateToDate(date: string): Date {
  const d = new Date(date);
  return d;
}
export function addDaysToDate(date: Date, days: number) {
  const newDate = addDays(date, days);
  return newDate;
}
export function getAge(dob:string){
  const dobDate = stringDateToDate(dob);
  const today = new Date();
  const age = today.getFullYear() - dobDate.getFullYear();
  return age;
}
