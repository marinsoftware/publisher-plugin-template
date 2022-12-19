import fs = require('fs');
import properties = require('properties');
import Replacer = require('pattern-replace');
import _ = require('lodash');
import YAML = require('yamljs');
import path = require('path');
import { ENCODING } from './enums/encoding.enum';
const envFileLocation = path.join(__dirname, '../../../conf/env.properties');
const yamlFileLocation = path.join(__dirname, '../../../conf/config.yaml');

// Read env and yaml files
let propertiesFileContent = undefined;
try {
  propertiesFileContent = fs.readFileSync(envFileLocation, ENCODING.UTF_8);
} catch (e) {
  // Use console.log instead of logger to avoid circular dependency. (logger depends on config)
  console.log(
    'conf/env.properties file was not found. Default values will be used.'
  );
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

        return _.has(envProp, variableName) && !_.isNil(envProp[variableName])
          ? envProp[variableName]
          : defaultVal;
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
  SERVER: {
    port: number;
    name: string;
    frontendHostname: string;
    protocol: string;
    host: string;
    env: string;
  };
  GELF: {
    host: string;
    port: number;
  };
}
