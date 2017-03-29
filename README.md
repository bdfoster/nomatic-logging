# nomatic-logging
[![Build Status](https://travis-ci.org/bdfoster/nomatic-logging.svg?branch=master)](https://travis-ci.org/bdfoster/nomatic-logging) [![Coverage Status](https://coveralls.io/repos/github/bdfoster/nomatic-logging/badge.svg?branch=master)](https://coveralls.io/github/bdfoster/nomatic-logging?branch=master)

**Get serious about logging.** This library takes the best concepts of
[winston](https://github.com/winstonjs/winston) and [bunyan](https://github.com/trentm/node-bunyan) to create a flexible
yet elegant logging solution for any Node.js library or application. You decide what to do with generated logs by using
the included transports or creating your own, very easily. You can even decide how to manage logs from your project's
dependencies (if they are using this library, of course). A log doesn't have to be just a message, either. You can
data to the log message or have a message generated for you from the data via templates.

The biggest motivating factor to start this project was infact the demise of 
[winston](https://github.com/winstonjs/winston), my go-to logging library. Unfortunetly, it is no longer maintained and
is also too time-consuming to me to reboot it as-is. I also wanted to provide a logging library written with
[TypeScript](http://typescriptlang.org), mostly due to the way type-checking is done in most modern IDEs and the ability
to reduce testing overhead. [bunyan](https://github.com/trentm/node-bunyan) looks great, however it's just too
complicated for most of my use-cases.

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

You can create your own transport very easily:
```javascript
const myTransport = logging.transport({
    level: 'info',
    handle(entry) {
        // do something with the log entry
    }
});
```
You can send log entries to a database, a file, a remote server, whatever you want. This is where `nomatic-logging`
becomes very powerful, and not just a complicated replacement for `console.log()`.

You can then subscribe `myTransport` to one logger, or many loggers:
```javascript
logger.subscribe(myTransport);
logging('my.other.namespace').subscribe(myTransport);
```

A log `entry` object looks like this:
```typescript
interface Entry {
  namespace: string;
  level: string,
  message: string,
  hostname: string,
  createdAt: Date,
  data?: Object;
}
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

## Future Plans
* Make usable in both Node.js and the browser
* Add more default transports, including:
  - HTTP (sending log entries via JSON or text to a remote server)
  - File (with log-rotate capabilities)
* Improve test cases, remove clutter, etc. to build even more confidence in the project

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