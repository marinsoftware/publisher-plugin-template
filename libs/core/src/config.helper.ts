import fs = require('fs');
import properties = require('properties');
import Replacer = require('pattern-replace');
import _ = require('lodash');
import YAML = require('yamljs');
import path = require('path');
import { ENCODING } from '@libs/core';
console.log(__dirname)
const envFileLocation = path.join(__dirname, '../../../conf/env.properties');
const yamlFileLocation = path.join(__dirname, '../../../conf/config.yaml');

// Read env and yaml files
let propertiesFileContent = undefined;
try {
  propertiesFileContent = fs.readFileSync(envFileLocation, ENCODING.UTF_8);
} catch (e) {
  // Use console.log instead of logger to avoid circular dependency. (logger depends on config)
  console.log('conf/env.properties file was not found. Default values will be used.');
}

const yamlFileContent = fs.readFileSync(yamlFileLocation, ENCODING.UTF_8);

// Parse env.peroperties file into object
const envProp = properties.parse(propertiesFileContent, {
  variables: true,
  namespaces: false,
  sections: false,
});

// Configs to replace variables in yaml files
const replacerOptions = {
  patterns: [
    {
      // Match patterns like ${tds.host:- dit-tds-vip.labs.marinsw.net:8989} in the yaml file
      match: /\${.*}/g,
      replacement: function (pattern: string) {
        // ${tds.host:- dit-tds-vip.labs.marinsw.net:8989} splits into
        // [ '',
        //  'tds.host',
        //  ':- dit-tds-vip.labs.marinsw.net:8989',
        //  ' dit-tds-vip.labs.marinsw.net:8989',
        //  '' ]
        const patternSplit = pattern.split(/\${([^:]*)(:-(.*))?}/);
        const variableName = patternSplit[1];
        const defaultVal = patternSplit.length > 3 ? patternSplit[3] : '';

        return _.has(envProp, variableName) && !_.isNil(envProp[variableName]) ? envProp[variableName] : defaultVal;
      },
    },
  ],
};

// Repalce variables in yaml file content
const envReplacer = new Replacer(replacerOptions);
const replacedYamlFile = envReplacer.replace(yamlFileContent);

// Parse yaml into json
export const config: Config = YAML.parse(replacedYamlFile);

export default config;

export interface Config {
  LOCAL_DEV_TESTING: boolean;
  USE_LOCAL_CACHE: boolean;
  ENVIRONMENT: string;
  DEFAULT_MARIN_USER_LEGACY_ID: string;
  CLIENT_SECRET: string;
  MARIN_ONE_FEND_STORE: {
    host: string;
    user: string;
    password: string;
    database: string;
    connectionLimit: number;
  };
  FEND_STORE_TABLE_NAMES: {
    REPORT: string;
    SAVED_VIEWS: string;
    CUSTOM_COLUMNS: string;
    SCHEDULED_REPORTS: string;
    DASHBOARDS: string;
  };
  TDS_CONFIG: {
    report: {
      schemaName: string;
      tableName: string;
    };
    savedViews: {
      schemaName: string;
      tableName: string;
    };
    customColumns: {
      schemaName: string;
      tableName: string;
    };
    scheduledReports: {
      schemaName: string;
      tableName: string;
    };
    jobRules: {
      schemaName: string;
      tableName: string;
    };
    jobSchedules: {
      schemaName: string;
      tableName: string;
    };
    accounts: {
      schemaName: string;
      tableName: string;
    };
    dashboards: {
      schemaName: string;
      tableName: string;
    };
    users: {
      schemaName: string;
      tableName: string;
    };
  };
  HEALTH_CHECK_DEPENDENCY_PARAMS: {
    customerId: number;
    clientId: number;
    userId: number;
    AUDIT_LOG: {
      objectId: string;
      objectType: string;
    };
    SIDE_PANEL: {
      objectId: string;
      objectType: string;
      publisherId: string;
      accountId: string;
    };
    JOB_MANAGER: {
      jobId: number;
    };
  };
  REPORT: {
    PAGE_SIZE: number;
    DRIP_DROP_PAGE_SIZE: number;
  };
  KAFKA: {
    ZOOKEEPER_URL: string;
    MONITOR_TIMEOUT_MINS: number;
    USER_REPORT: {
      TOPIC: string;
      GROUP_ID: string;
    };
    PACING_DASHBOARD_REPORT: {
      TOPIC: string;
      GROUP_ID: string;
    };
  };
  APM: {
    URL: string;
    NAME: string;
  };
  NFS_ROOT_PATH: {
    report: string;
    FTP: string;
    CMT: string;
  };
  GRAPHITE_SERVER: string;
  TEMP_DIR: string;
  SERVER: {
    port: number;
    name: string;
    frontendHostname: string;
    protocol: string;
    host: string;
    env: string;
  };
  REDIS: {
    enabled: boolean;
    hosts: string;
    name: string;
    defaultExpirationTimeMinutes: number;
  };
  SSO: {
    siteID: string;
    siteSecretKey: string;
  };
  DATA_SERVICES: {
    [key: string]: {
      cacheEnabled: boolean;
      cacheExpirationMinutes: number;
      healthCheck: {
        serviceName: string;
        port?: number;
        path?: string;
      };
      protocol: string;
      host: string;
      pathname: string;
      assetsPathname: string;
    };
  };
  HEALTH_SERVICE_PATH: string;
  PERFORMANCE_LOG: {
    VERSION: number;
  };
  SENDGRID: {
    apiKey: string;
    fromEmail: string;
  };
  GELF: {
    host: string;
    port: number;
  };
  ACL: {
    salt: string;
  };
  TRACKER_QUICKSIGHT_DASHBOARD: {
    awsAccountId: string;
    awsAccessKeyId: string;
    awsSecretAccessKey: string;
    awsZone: string;
    clientIdHashKey: string;
    itpDashboardId: string;
    diagnosticDashboardId: string;
    offlineDashboardId: string;
    analyticsDashboardId: string;
  };
}
