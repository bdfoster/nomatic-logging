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

## Basic Usage

To create a logger (or get an existing Logger instance):
```javascript
const logger = require('nomatic-logger')('my.namespace');
```
...which is equivalent to (if the namespace is not already taken):
```javascript

const logging = require('nomatic-logger');
const logger = logging.create({
    namespace: 'my.namespace',
    transports: [
        logging.transport.console({
            level: 'info'
        })
    ]
});
```
Now, ```logger``` has a namespace of ```my.namespace``` and a way to send logs of level ```info``` and above to the console.

Then, to use it:
```javascript
logger.info('This is a test message');
// with data:
logger.info('This is a test message with data', {
    isTest: true
});
```
You read that right. You can send data with your message. As a matter of fact, you can just send data with your log and 
have the ```Logger``` parse it into a message for you:
```javascript
logger.template = '{method} {url} {status} {length} {ms}';
logger.info({
    method: 'GET',
    url: '/path/to/resource',
    status: 200,
    length: '1214',
    ms: 22
});
```

To listen for all logging events on a namespace:
```javascript
logger.on('entry', (entry) => {
    /* `entry` is an object with `namespace`, `message`, `level`,
    * `hostname`, `createdAt`, and optional `data` fields.
    */
    console.log(`[${entry.level}]\t${entry.message}`);
});
```

To listen for the 'info' log level entries:
```javascript
logger.on('info', (entry) => {
    console.log(`[INFO]\t${entry.message}`);
});
```
Because we are using ```EventEmitter``` from [```nomatic-events```](https://www.npmjs.com/package/nomatic-events), you can also use a regex:
```javascript
logger.on(/(info|debug)/, (entry) => {
    console.log(`[${entry.level}]\t${entry.message}`);
})
```

The pattern works best in the following fashion:
  * Library developers ```create``` a namespace, and let their users know about it.
  * Application developers subscribe to each instance and decide how they want to handle logging (i.e. display to console, send to a database, etc.). Application developers can also create their own namespaced instances for their own logging needs.



This library is developed with [TypeScript](http://www.typescriptlang.org/), and as such, includes definitions. However, you do not even need to know what TypeScript is to use this package. The compiled project is included in the [npm package](http://npmjs.com/package/nomatic-logger).
