# Raspberry Pi LED Control &middot;

[![Node.js CI](https://github.com/rpitv/pi-led-control/actions/workflows/node.js.yml/badge.svg)](https://github.com/rpitv/pi-led-control/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/rpitv/pi-led-control/branch/master/graph/badge.svg?token=doiWhO8Q1K)](https://codecov.io/gh/rpitv/pi-led-control)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

> Control different types of LEDs from your Raspberry Pi.

## Features

- Control different types of LEDs from your application.
  - Single channel
  - RGB/tri-channel
  - Arbitrary channel count
- Diode mode, allowing you to remove a dedicated ground.
- Flash LEDs at any frequency.
- Animate your LEDs using your own custom functions.

## Necessary supplies

- Raspberry Pi (any should do, as long as it has GPIO).
- LED(s) w/ necessary resistors.
- Diodes for the ground connection, if using diode mode.

Hardware instructions coming sometime in the future.

## Usage

TODO Coming soon

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

### Testing

A unit test suite is available for the full API. You may run the test suite by executing:

```shell
npm test
```

Since you presumably will not be developing on a Raspberry Pi, it's important to have a complete testing suite, particularly for components which interact with the Raspberry Pi GPIO pins.

### Style guide

This project follows the guidelines found here: https://github.com/elsewhencode/project-guidelines

The main rule from these guidelines that we do not follow is commits do not necessarily have to go into a dev branch before master. It is up to your distrection to determine whether it would be appropriate to do so.

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
