# Starting point
There is a sample application within the apps directory called `api`, this can remain as it is. However, you may use it in action by running `nx serve api`.
To create a new NestJS application, please run `nx g @nrwl/nest:app my-new-app`; this will scaffold a new application within the apps directory. Then change the values in the `nx.json`, `pm2.json` `package.json` and `pom.xml` to reflect the application's name and the project/workspace name. Then run `nx serve nmy-new-app` or `npm run start-dev` to see the application generated in action.
## Node Swagger - NX Workspace
NX workspace is a build system influenced explicitly by the Angular CLI to create large applications. We are using it here because we can easily add new applications into the workspace enabling better code sharing between applications. Using the `NX Console` vscode plugin, the Nest CLI can easily be clicked through for a better dev experience.

## Swagger
Utilising the OpenApi specification, we can have easy-to-follow documentation with examples to create interfaces to consume api's much more quickly. Furthermore, using the URL end-point, we can generate frontend services in Angular to communicate with the backend code using generators instead of manually managing the frontend services. This automation reduces development time significantly.

## NestJS

Nest JS is a MVC NodeJS framework influenced by Angular. Therefore it has a powerful CLI and loosely coupled component architecture to create high-quality typescript applications. The NX workspace fully supports NestJS and the CLI commands are integrated to speed up development. 

http://localhost:3000/api is hosting the swagger ui
http://localhost:3000/api-json has the Swagger JSON consumed by the openapi-generator to generate the generated code.

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
