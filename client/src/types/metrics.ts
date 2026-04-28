export interface SummaryMetric {
  key: 'foodDelivery' | 'tableReservation' | 'paymentProcessing' | 'otherFlows';
  label: string;
  value: number;
  trendPct: number;
  subLabel: string;
}

export interface FlowSlice {
  flow: string;
  pct: number;
  color: string;
}

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface CallDistribution {
  day: DayOfWeek;
  hourly: number[];
}

export interface CallsHandledPoint {
  date: string;
  successful: number;
  unsuccessful: number;
}

export interface DurationByDay {
  day: DayOfWeek;
  seconds: number;
}

export type CallsHandledRange = 'today' | '7d' | '30d';
