# vito
Graphical user Interface for the Viessmann Heating System

## Prerequisites

You need to have node installed in the version defined in `.nvmrc`. Using
[nvm](https://github.com/nvm-sh/nvm) is an easy way to ensure that the suitable
node version is installed.

## Installation

Donwload the source code with
```
git clone https://github.com/nexx512/vito.git
```
and go into the folder `vito`.

If you have [nvm](https://github.com/nvm-sh/nvm) installed, run `nvm use`. If
necessary, install the correct node version using `nvm install`.

Set up the configuration. Use the an example config file in `config/config.exmaple.json`
and save it with you modification in `config/config.json`

Install all necessary nvm module with
```
npm i
```

Build the assets for production use with
```
npm run build
```

## Starting the server

You can now starts and stop the server with the start/stop scripts in `scripts/local`.
Start the server with
```
./scripts/local/start.sh
```
or stop it with
```
./scripts/local/stop.sh
```

## Development

For developing the application, you can run it in a development environment.
There is a specific npm task to create the assets on the fly while working on
the source files. Start this build process with
```
npm run develop
```

If you want to test your application against a local mock server instead of a real
vcontrold server, you can start the mock with
```
npm run mock
```
This mock takes its data from the mock configuration file
`mock/mockvcontrolddata.json`. When this file is modified, the mock is restarted
automatically.

Now you can start the vito server with
```
npm start
```

## Testing

As a good software developer you will surely write your tests before implementing
functionality. To simplify test driven development you can run the all tests with
```
npm run test
```
In case you were developing using the vcontrold mock, you must first stop it,
if you want to start integration or end to end tests. They will start their own
mock.

To run only a certain kind of tests, you can use one of the following tasks
```
npm run test:unit
npm run test:integration
npm run test:end2end
```

For the end to end tests, [cypress](https://www.cypress.io/) is used as test
framework. If you want to run it interactively, you can start with with
```
./node_modules/.bin/cypress start
```
