export interface CalendarDate {
  momentDate: moment.Moment;
  weekDay: number;
  selected?: boolean;
  disabled?: boolean;
  today?: boolean;
}
