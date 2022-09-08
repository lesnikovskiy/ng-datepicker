import { Interval } from 'date-fns';

export interface TimelineModel {
  title: string;
  interval: Interval,
  className: string;
}
