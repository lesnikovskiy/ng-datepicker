import { Interval } from "date-fns";

export interface RangeOptionModel {
  title: string;
  interval: Interval;
  isCustom?: boolean;
}
