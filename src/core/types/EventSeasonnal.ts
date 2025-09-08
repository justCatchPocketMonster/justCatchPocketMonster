export interface EventSeasonnal {
  id: number;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  image: string | null;
  statMultipliers: Record<string, any>;
}
