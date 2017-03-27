# nomatic-logger
[![Build Status](https://travis-ci.org/bdfoster/nomatic-logger.svg?branch=master)](https://travis-ci.org/bdfoster/nomatic-logger) [![Coverage Status](https://coveralls.io/repos/github/bdfoster/nomatic-logger/badge.svg?branch=master)](https://coveralls.io/github/bdfoster/nomatic-logger?branch=master)

Get serious about logging. This library takes the best concepts of
[winston](https://github.com/winstonjs/winston) and
[bunyan](https://github.com/trentm/node-bunyan) but diverges to create
an extremely flexible yet elegant logging solution.

## Installation

You can install from [NPM](https://www.npmjs.com/package/nomatic-logger) by doing:
```bash
npm install --save nomatic-logger
```

## Usage

To create a logger (or get an existing Logger instance):
```javascript
const logger = require('nomatic-logger')('my.namespace');
```

To exclusively create a logger on a namespace (or throw if one exists):
```javascript
const logger = require('nomatic-logger').create('my.namespace');
```

Then, to use it:
```javascript
// log[level](message: string[, data: Object])
logger.info('This is a test message');
// with data:
logger.info('This is a test message with data', {
  isTest: true
});
```

To listen for logging events on a namespace:
```javascript
const logger = require('nomatic-logger')('my.namespace');
logger.on('info', (entry) =>
  /* `entry` is an object with `namespace`, `message`, `level`,
   * `hostname`, `createdAt`, and optional `data` fields.
   */
  console.log(`[${entry.level}]\t${entry.message}`);
});
```

The pattern works best in the following fashion:
  * Library developers create a namespaced Logger instance, and let their users know about it
  * Application developers subscribe to each instance and decide how they want to handle logging (i.e. display to console, send to a database, etc.). Application developers can also create their own namespaced instances for their own logging needs.

The mechanisms that "do" something with the log entries are called ```transports``` (this is taken from ```winston```). This functionality has not been implemented, but it will be very soon. For now, you can subscribe to a logger using the method in the last example above, as it will never go away.

This library is developed with [TypeScript](http://www.typescriptlang.org/), and as such, includes definitions. However, you do not even need to know what TypeScript is to use this package. The compiled project is included in the [npm package](http://npmjs.com/package/nomatic-logger).
