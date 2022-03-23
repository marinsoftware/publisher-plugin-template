/* eslint-disable @typescript-eslint/ban-types */
declare module '*.json' {
  const value: any;
  export = value;
}

// Testing.
declare const expect: Chai.ExpectStatic;
declare const sandbox: any;
declare const sin: sinon.SinonStatic;
declare const proxyquire: any;
type StubInstance<T> = {
  [P in keyof T]: sinon.SinonStub;
};

// Global logging.
declare const logger: any;

// Whitelist modules with no types to prevent errors.
declare module 'properties';
declare module 'pattern-replace';
declare module 'comma-separated-values';
declare module 'fs-path';
declare module 'walk';
declare module 'kafka-node';
declare module 'basic-auth';

// Fix bugs in NodeJS typings.
declare module 'url' {
  export function format(url: string): string;
}
interface Object {
  entries: (obj: any) => any;
}

interface UserSession {
  customerId: number;
  userId: number;
  clientId: number;
}

interface DownStreamRequestDuration {
  service: string;
  duration?: number;
  endTime: number;
  startTime: number;
  isCache: boolean;
}

interface Column {
  key: string;
  category?: string;
  label?: string;
  description?: string;
  minWidth?: number;
  maxWidth?: number;
  parentKey?: string;
  isMandatory?: boolean;
  disableSort?: boolean;
  isHidden?: boolean;
  isEditable?: boolean;
  filterConfig?: {
    type?: string;
    dataType?: string;
    options?: any;
    singleSelect?: boolean;
    mappedOptions?: any;
  };
  dataType?: string;
  enumMap?: any;
  columnGroup?: string;
  isColumnHolder?: boolean;
  metadata?: ColumnMetadata;
  defaultWidth?: number;
  suppressResize?: boolean;
  translateLabel?: boolean;
  definition?: string;
  marsColumnKey?: string;
  expansionConfig?: { columnId: string; expansions: Array<any> };
}
interface ColumnMetadata {
  hiddenColumnKeys?: Array<string>;
  colorLegendMap?: any;

  // Used in hybrid bidding grid
  numericRendererDefaultValue?: string;

  // use in hybrid rollup
  level?: string;
}

interface User {
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  customerId: number;
  id: number;
  legacyIds?: string[];
  userName: string;
  email: string;
  jobTitle: string;
  passwordSalt: string;
  password: string;
  forcePasswordReset: boolean;
  roles: Array<string>;
  firstName: string;
  lastName: string;
  lastConnection: string;
  status: string;
  preferences: string;
  image: string;
  phoneNumber: string;
  msgBstrOptObjs: string;
  msgBstrOptHidAudCrtr: string;
  msgBstrOptHidBdHandl: string;
  msgBstrOptHidRlesHandl: string;
  msgBstrOptAllPges: string;
  language: string;
  isUserRole: boolean;
  isCustomerUser: boolean;
  customerName: string;
  name: string;
  title?: string;
  access?: string;
  defaultClientId?: number;
  permissions: Array<{
    accessRoleClientId: number;
    accessRole: string;
  }>;
  clients?: Array<any>;
  defaultDashboardId: number;
}

interface Client {
  id: number;
  customerId: number;
  name: string;
  reportingWeek: string;
  notes: string;
  locale: string;
  timezone: string;
  currency: string;
  contactName: string;
  jobTitle: string;
  contactMail: string;
  contactPhone: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: number;
  status: string;
  logo: string;
  reportingComponentId: string;
  campaignFormat: string;
  adFormat: string;
  pitchSmartAgeRangeOn: boolean;
  pitchSmartAgeRange: string;
  hasArchives: string;
  autoPauseOn: boolean;
  autoPauseVal: string;
  legacyId?: string;
  legacyIds?: string[];
  betaFeatures?: string[];
  trackingId: string;
  trackingParams: string;
  trackignParamDelimiter: string;
  trackingParamStopChars: string;
  trackingParamConcat: string;
  sitelinkParam: string;
  sitelinkParamDelimiter: string;
  sitelinkParamStopChar: string;
  urlbOnSync: string;
  permissions: Array<{
    accessRole?: string;
    accessRoleUserId: number;
  }>;
  defaultDashboardId: number;
  linkedPublishers?: string[];
  metadata?: ClientMetadata[];
}

// This is client tag
interface ClientMetadata {
  id: number;
  key: string;
  value: string;
}

interface RowParams extends UserSession {
  id?: string;
  filters?: any;
  columnKeys?: Array<string>;
  limit?: string;
}

interface RowReturn {
  rows: Array<any>;
  totalCount: number;
}

type GridId = string;

interface CustomColumn extends UserSession {
  id: string;
  name: string;
  format: string;
  definition: string;
}

interface TdsPrimaryKey extends UserSession {
  id: string;
}

interface Customer {
  id: number;
  name: string;
  country: string;
  status: string;
  apiOn: boolean;
  apiEnabledAt: Date | undefined;
  apiDisabledAt: Date | undefined;
  parentId: number;
  betaFeatures?: string[];
  legacyIds?: string[];
  legacyMarinId: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: number;
  passwordComplexity: string;
  locale: string;
  currency: string;
  trialLength: string;
}

interface Route {
  path: string;
  method: 'get' | 'post' | 'del' | 'put';
  controller: Function;
  ignoreAuthentication?: boolean;
  requestContract?: Function;
  keepResponseAlive?: boolean;
  doNotLogPerformance?: boolean;
  disableForUserRole?: boolean;
  isBasicAuth?: boolean;
  verifySessionContract?: boolean;

  // Allow the endpoint to be used by M1 or hybrid mode
  enableUseOfLegacyRequestDetails?: boolean;

  // Only allow hybrid mode. Fails request if hybrid mode can not be used
  onlyAllowLegacyRequestDetails?: boolean;

  // Only allow hybrid mode and ignore beta flag when checking for hybrid access.
  // Fails request if hybrid mode can not be used.
  useLegacyRequestDetailsIgnoreBetaFlag?: boolean;
}
