export interface DownStreamRequestDuration {
  service: string;
  duration?: number;
  endTime: number;
  startTime: number;
  isCache: boolean;
}
