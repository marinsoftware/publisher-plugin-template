// Use with:
// npm run create-env -- --env "func03"

import fs = require('fs');
import minimist = require('minimist');
import path = require('path');

const argv = minimist(process.argv.slice(2));

const env = argv.env || 'func03';
const confDir = './conf';
const envFile = path.join(confDir, '/env.properties');

// Remove current env.properties
fs.stat(envFile, (err) => {
  if (!err) {
    fs.unlinkSync(envFile);
  }
});

const envFormatFile = path.join(confDir, '/api-env-format.properties');
const reportFormatFile = path.join(confDir, '/report-env-format.properties');
const file = argv.report ? reportFormatFile : envFormatFile;

// Read the default file replace env with the new one
let data = fs.readFileSync(file, 'utf8');
data = data.toString().replace(`env=xxx`, `env=${env}`);
fs.writeFileSync(envFile, data);
console.log(`env.properties has been created with ${env} configuration`);
