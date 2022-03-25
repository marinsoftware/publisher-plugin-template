import { Request as IRequest } from 'express';

export interface RequestCustom extends IRequest {
  user: {
    id: number;
  };
  userCustomer: {
    id: number;
  };
  client: {
    id: number;
    timeZone?: string;
  };
  customer: {
    id: number;
  };
  headers: {
    authorization?: string;
  };
  reqId: string;
  mode: string;
  type?: string;
  disableCache: boolean;
  url_path: string;
  downStreamRequestDuration: Array<DownStreamRequestDuration>;
  errorEmitted: boolean;
}
