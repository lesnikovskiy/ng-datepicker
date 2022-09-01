export interface CalendarDate {
  mDate: moment.Moment;
  wDay: number;
  selected?: boolean;
  disabled?: boolean;
  today?: boolean;
}
