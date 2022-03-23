export const ALLOWED_HEADERS = {
  authorization: 'Authorization',
  traceID: 'x-marin-trace-id',
  acl: 'x-marin-acl-id',
  sharedDashboard: 'x-marin-shared-dashboard',
};

export enum ALLOWED_PARAMS {
  HASH_TOKEN = 'hash-token',
}
export enum ENCODING {
  UTF_8 = 'utf-8',
  UTF_16_LE = 'utf-16le',
  UTL_16_LE2 = 'utf16le',
}
