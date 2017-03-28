# nomatic-logging
[![Build Status](https://travis-ci.org/bdfoster/nomatic-logging.svg?branch=master)](https://travis-ci.org/bdfoster/nomatic-logging) [![Coverage Status](https://coveralls.io/repos/github/bdfoster/nomatic-logging/badge.svg?branch=master)](https://coveralls.io/github/bdfoster/nomatic-logging?branch=master)

Get serious about logging. This library takes the best concepts of
[winston](https://github.com/winstonjs/winston) and
[bunyan](https://github.com/trentm/node-bunyan) but diverges to create
an extremely flexible yet elegant logging solution.

## Installation

You can install from [npm](https://www.npmjs.com/package/nomatic-logging) by doing:
```bash
npm install --save nomatic-logging
```

## Basic Usage

To create a ```Logger``` (or get an existing Logger instance):
```javascript
const logger = require('nomatic-logging')('my.namespace');
```
...which is equivalent to (if the namespace is not already taken):
```javascript

const logging = require('nomatic-logging');
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

## Typescript
This library is developed with [TypeScript](http://www.typescriptlang.org/), and as such, includes definitions. 
However, you do not even need to know what TypeScript is to use this package. The compiled project is included in the 
[npm package](http://npmjs.com/package/nomatic-logging).

## Testing
You can run tests by doing:
```bash
npm test
```
A summary of code coverage shows up at the end of the output, but if you want the HTML site, do:
```bash
npm run coverage
```
I do strive for 100% code coverage since this is a very small library. I would ask for the same when submitting a PR.
If you need help with writing tests, ping me and I will either write them for you (if it's small enough) or give you
guidance on how to do so.

## Contributing / Support
Please note that this software is in the early stages of development, but is in production use in several of my
personal projects and university/work endeavors.

Pull requests are absolutely welcome, and issues can be raised for questions or bugs. I do understand the documentation is a 
little sparse at the moment, and I'm certainly working to expand that very, very soon. If you need help using the
library, submit an issue for it and I'll be sure to document it (first in the issue itself, then in the actual 
documentation).

Please remember that this is something I maintain and build upon in my spare time. If you need paid support for a 
particular solution, feature, or bug, please feel free to send me a message. Generally speaking, I'm very responsive
during the work week.