# Node Swagger - NX Workspace

NX workspace is a build system specifically influenced by the Angular CLI to create large applications. 

## Node Version Compatibilty
  v20.12.2

## Swagger
Utilising the OpenApi specification, we can create generated code from the backend api to use on the frontend. 

## NestJS

Nest JS is a MVC NodeJS framework influced by Angular, therefore it has a powerful CLI and loosely coupled component archtecture to create high quality typescript applications. The NX workspace fully supports NestJS and the CLI commands are integrated to speed up development. 

http://localhost:3333/api is hosting the swagger ui
http://localhost:3333/api-json has the Swagger Json that is consumed by the openapi-generator to generate the generated code.

## Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.


## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.


## VS Code Plugins
- 'Nx Console' for easy creation for nestJS resources
- 'Prettier' for formatting
- 'ESLint' for linting rules
- 'Jest Runner' for testing


### Logging 
https://github.com/vanthome/winston-elasticsearch
https://github.com/gremo/nest-winston



Install the dependencies:

```bash
npm install
```

Running locally:

```bash
npm run build
npm run start-dev
```

Running in production:

```bash
npm run build
npm start
```

Testing:

```bash
# run all tests
npm run test
npm run test-dev
```

## Environment Variables
use env.properties inside conf folder at the root of the project, you can add your variables there along with there default values:

```bash
# Port number
PORT=3333

# To set the publisher Developer App settings.
# Example to create new publisher app read  README-PUBLISHER-SPECIFIC.md
REDIRECT_URI="REDIRECT URL TO YOUR CLIENT PORTAL"
APP_ID="PUBLISHER APP ID"
SECRET_ADS="PUBLISHER APP SECRET"
```

# Setup environment/environment.ts file
# For any urls wich will remain static in any env we add these credentials here
AUTH_BASE_URL="PUBLISHER AUTH URL"
ADS_BASE_URL="publisher API BASE URL"
HEALTH_AUTH_CODE="YOUR HEALTH TOKEN ACCESS KEY"

### Linking Endpoints
# READ README-REQUIRED-EXTENDED-URLS.md 
1 `GET /api/publishers` - get list of all publisher\
2 `POST /api/oauth` - get oauth url against publisher details provided in req body\
3 `POST /api/publisherAccounts` - get accounts against publisher details provided in req body\

First endpoint is to fetch publisher information.
  This inforrmation contains publisher DB Id, name, publisher fields for UI and field types

Second endpoint is to create oauth url.
  Marin send request to this endpoint to retrieve the oauth url on which end users can perform the login and authenticate the account so marin can have the refresh token

Third endpoint is to have the refresh token.
  Marin send request to this endpoint to retrieve the refrresh toen, access token, account id.
  This api performs two http request
  First to retrieve the token (refresh,access)
  Second to retrieve publisher account information for which user has authenticated
  Send the informaton in a marin accepting format


### API Endpoints
  # COMEPLETE DOCUMENTATION README-API-HANDLING.md


## Marin API Versioning Guidance
  # Marin Api supports url versions.
  1. URL versioning is an approach to API versioning where the version number is included in the URL itself. Typically, the version number is appended to the base URL of the API, separated by a forward slash.
  2. Currently we have not indroduced versioning in marin api but in furutre if versioning introducted it will be url versioning

## Publisher API Versioning Guidance
  # Publisher Api Versions gets changes as api sunset date
  # UPDATE Api versions before sunset inorder to support publishers
  1. Api versioning for publisher will be added within template to communicate with publishers api.
  2. Use latest api versions to communicate with publishers