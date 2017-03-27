# nomatic-logger
[![Build Status](https://travis-ci.org/bdfoster/nomatic-logger.svg?branch=master)](https://travis-ci.org/bdfoster/nomatic-logger)

Get serious about logging. This library takes the best concepts of
[winston](https://github.com/winstonjs/winston) and
[bunyan](https://github.com/trentm/node-bunyan) but diverges to create
an extremely flexible yet elegant logging solution.

To create a logger:
```javascript
const logger = require('nomatic-logging');

// logger.create(namespace: string)
const logger = logging.create('test');
```

Then, to use it:
```javascript
// log[level](message: string[, data: Object])
log.info('This is a test message');
// with data:
log.info('This is a test message with data', {
  isTest: true
});
```

To listen for logging events on a namespace:
```javascript
const logging = require('nomatic-logger');
logging.instance('test').on('info', (entry) => {
  /* `entry` is an object with `namespace`, `message`, `level`,
   * `hostname`, and `createdAt` fields.
   */
  console.log(`[${entry.level}]\t${entry.message}`);
});
```

The pattern works best in the following fashion:
  * Library developers create a namespaced Logger instance, and let their users know about it
  * Application developers subscribe to each instance and decide how they want to handle logging (i.e. display to console, send to a database, etc.). Application developers can also create their own namespaced instances as for their own logging needs.
