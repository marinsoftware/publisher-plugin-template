# Marin Publisher Plugin Support Template

Plugin gateway template between Marin & Publishers. This is a template which contributors can extend to connect with Publishers. This uses Node Nest JS modern framework that is influenced by Angular.

## Quick Start

- Download Node v20.x.x
- `git clone` this repo
- `npm i`
- Run `npm run start-dev` to start the service locally
- Checkout API http://localhost:3333/api
- Swagger: http://localhost:3333/api-json

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

## VS Code/Cursor Plugins

- 'Nx Console' for easy creation for nestJS resources
- 'Prettier' for formatting
- 'ESLint' for linting rules
- 'Jest Runner' for testing

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

## Setup environment constants environment.ts file

eg:

```
AUTH_BASE_URL="PUBLISHER AUTH URL"
ADS_BASE_URL="publisher API BASE URL"
HEALTH_AUTH_CODE="YOUR HEALTH TOKEN ACCESS KEY"
```

## Endpoints

- [API Linking endpoints](README-API-HANDLING.md)
- [Eg: Taboola publisher](README-PUBLISHER-SPECIFIC.md)

## Marin Api supports url versions.

1. URL versioning is an approach to API versioning where the version number is included in the URL itself. Typically, the version number is appended to the base URL of the API, separated by a forward slash.
2. Currently we have not indroduced versioning in marin api but in furutre if versioning introducted it will be url versioning

## Unit Test Cases

1. For each app write unit test cases
2. Atleast 80% test coverage is recommended
