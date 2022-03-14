# Raspberry Pi LED Control &middot;

[![Node.js CI](https://github.com/rpitv/pi-led-control/actions/workflows/node.js.yml/badge.svg)](https://github.com/rpitv/pi-led-control/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/rpitv/pi-led-control/branch/master/graph/badge.svg?token=doiWhO8Q1K)](https://codecov.io/gh/rpitv/pi-led-control)
[![CodeQL](https://github.com/rpitv/pi-led-control/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/rpitv/pi-led-control/actions/workflows/codeql-analysis.yml)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

> Control different types of LEDs from your Raspberry Pi.

## Features

- Control different types of LED and LED arrays from your application.
  - Single channel
  - Multi channel (e.g. RGB)
  - LED segment displays
- Flash LEDs at any frequency.
- Animate your LEDs using your own custom functions.

## Necessary supplies

- Raspberry Pi (any should do, as long as it has GPIO).
- LED(s).
- Any necessary resistors/transistors.

Hardware instructions coming sometime in the future.

## Usage

### Basic Example

```js
const { LED } = require("pi-led-control");
// Other imports: LEDArray, Animation, Curves

const led = new LED(3);
led.write(true);
led.off();
```

### More Examples

More examples of how to use all of the available imports are available in the [`/examples`](./examples) folder.

### Specifications

TODO. For now, please refer to the examples and JSDocs within the code.

## Development

### Prerequisites

You must install Node.js and NPM before beginning to develop or use this library. Currently, only Node LTS v12, v14, and v16 are tested. Any other version is not guaranteed to work.

It's recommended you install Node.js and NPM using [nvm](https://github.com/nvm-sh/nvm).

### Setting up Dev Environment

Run the following script in order to begin development:

```shell
git clone https://github.com/rpitv/pi-led-control.git
cd pi-led-control/
npm install
npm run prepare
```

You are now ready to write code. All application code is located within [/src](./src). Begin writing in your `.ts` files. It is presumed you will not be developing on a Raspberry Pi. If you do, then you may run the application using `npm start`. Otherwise, use `npm test` to run unit tests on your code.

### Building

The library can be built with the following command:

```shell
npm run build
```

Building and deployment is handled by CI, if you wish to use the main NPM package.

### Testing

A unit test suite is available for the full API. You may run the test suite by executing:

```shell
npm test
```

Since you presumably will not be developing on a Raspberry Pi, it's important to have a complete testing suite, particularly for components which interact with the Raspberry Pi GPIO pins.

### Style guide

This project follows the guidelines found here: https://github.com/elsewhencode/project-guidelines

The main branch is the development branch. When it's time for a release, `dev` is merged into `release`.

Code style is enforced using ESLint. Continuous Integration runs the linter before unit tests, however you may also run the linter yourself using:

```shell
npm run lint
```

Automatically fix style issues with:

```shell
npm run fix
```

This command will automatically run in a pre-commit Git hook.

## Licensing

[This project is licensed under the MIT license.](./LICENSE)
