import { RequestType } from "./request-type.enum";

export class LogObject {
  category: 'performance';
  env: string;
  namespace: string;
  traceId: string;
  host: string;
  service: string;
  headers: Record<string, unknown>;
  point: string;
  url_path: string;
  requestType: RequestType | string;
  isSuccess: boolean;
  resultString: string; 
  startTimeDate: Date; 
  duration: number;
  size: number;
  categoryVersion: number;
  params: string;
  error: string;
  numOfDays:number;
    constructor() {
        this.numOfDays = 0;
        this.requestType = '';
    }
}