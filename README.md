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
# Inorder to extend this plugin we need to support following endpoints
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

List of available routes:

**Publisher routes**:\
`GET /api/campaigns` - Get All Campaigns\
`GET /api/groups` - Get All Groups\
`GET /api/ads` - Get All Ads\
`GET /api/keywords` - Get All Keywords\
`GET /api/properties` - Verify if shopping products are available\
`GET /api/reporting/public/v1.0/report` - Get snapshot\
`PUT /api/campaigns` - Edit Campaigns\
`PUT /api/groups` - Edit Groups\
`PUT /api/ads` - Edit Ads

**Health routes**:\
`GET /admin/status/marin-taboola-api-service/L1` - check health of this microservice\
`GET /admin/status/marin-taboola-api-service/L2` - check health of third party api's\
`GET /admin/status/marin-taboola-api-service` - check health of third party api's and this microservice\

 **Snapshot routes**:\
 `GET /api/reporting/public/v1.0/report?accountId=***&publisherId=141&startDate=2024-04-13&endDate=2024-07-14&refreshToken=**-A&reportType=group` - implement cost rev to fetch reporting data from publisher\


## API Handling

`GET /publishers` - get list of all publisher\

> Open your /src/config/publisher.json
> Add a publisher you want to interact with for example
> [
> {

    "publisher": "GENERIC",
    "publisherDefinition": "TABOOLA",
    "authenticationType": "OAUTH2",
    "linkingParamValList": [
      {
        "fieldName": "accountName",
        "fieldValueType": "String",
        "localizedText": "Account Name",
        "localizedTextKey": "ACCOUNT_NAME_LABEL",
        "required": false
      },
      {
        "fieldName": "accountId",
        "fieldValueType": "String",
        "localizedText": "Account Id",
        "localizedTextKey": "ACCOUNT_ID",
        "required": true
      }
    ]

}
]

- publisherDefinition : PUBLISHER NAME
- authenticationType: AUTH TYPE
- linkingParamValList: List of attribute that we need to ask user from frontend, so we can search the account based upon those information

Once above publisher is added in json file, your first API will start giving you response

`POST /oauth` - get oauth url against publisher details provided in req body\
Once you have setup your .env file as per the directions given in Environment Variables section. This endpoint will start giving you required auth URL.

URL PARAMS
    1. scope: In taboola we need to provide scope variable in url param. This is a comma delimited list of scope names covering the specific data and/or functions you want to access for this user. You must request access to at least one scope.
    2. client_id: This is the unique ID for your app also referred to as App ID.
    3. redirect_uri: This must be one of the redirect URIs registered on your app. The value of this parameter must exactly  match the registered value.
    4. response_type: Set this value to the literal string code
    5. state(optional): This parameter can be any string value defined by you.

`POST /publisherAccounts` - get accounts against publisher details provided in req body\
To return token and account details, you need to customized the controller, as you need to interact with publisher interal API

## API AUTH CURL REQUESTS

  # Request 1
  # List all active Publisher
  curl -X 'GET' 'http://localhost:3333/publishers' -H 'accept: application/json'
  ​
  ​
  # Request 2
  # Retrieve encoded auth URL for valid publisher
  curl -X 'POST' 'http://localhost:3333/oauth' -H 'accept: application/json' -H 'Content-Type: application/json' -d '{ "state": "Unknown Type: Any", "publisher": "TABOOLA", "clientID": "any", "redirect_uri": "https://cloudfunc15-frontend-101.aws.marinsw.net/transientPage"}'
  ​
  ​
  ​
  # Request 3
  # use auth_code or code value comes back from auth url after authorization in code key under request body
  # Retrieve publisher Accounts
  curl -X 'POST' \
    'http://localhost:3333/publisherAccounts' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "responseUrl": "https://marin.com",
    "publisher": "TABOOLA",
    "redirect_uri": `redirect_uri`,
    "accountID": `accountID`,
    "accountName": `accountName`,
    "clientID": `clientID`,
    "code": `code`
  }'


## Marin API Versioning Guidance
  # Marin Api supports url versions.
  1. URL versioning is an approach to API versioning where the version number is included in the URL itself. Typically, the version number is appended to the base URL of the API, separated by a forward slash.
  2. Currently we have not indroduced versioning in marin api but in furutre if versioning introducted it will be url versioning

## Publisher API Versioning Guidance
  # Publisher Api Versions gets changes as api sunset date
  # UPDATE Api versions before sunset inorder to support publishers
  1. Api versioning for publisher will be added within template to communicate with publishers api.
  2. Use latest api versions to communicate with publishers