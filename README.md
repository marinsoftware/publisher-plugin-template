

# Node Swagger - NX Workspace

NX workspace is a build system specifically influenced by the Angular CLI to create large applications. 

## Swagger
Utilising the OpenApi specification, we can create generated code from the backend api to use on the frontend. 

## NestJS

Nest JS is a MVC NodeJS framework influced by Angular, therefore it has a powerful CLI and loosely coupled component archtecture to create high quality typescript applications. The NX workspace fully supports NestJS and the CLI commands are integrated to speed up development. 

http://localhost:3000/api is hosting the swagger ui
http://localhost:3000/api-json has the Swagger Json that is consumed by the openapi-generator to generate the generated code.

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
