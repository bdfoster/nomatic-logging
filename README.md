# nomatic-logging
[![GitHub release](https://img.shields.io/github/release/bdfoster/nomatic-logging.svg)](https://github.com/bdfoster/nomatic-logging/releases)
[![npm](https://img.shields.io/npm/v/nomatic-logging.svg)](https://www.npmjs.com/package/nomatic-logging)
[![Build status](https://img.shields.io/travis/bdfoster/nomatic-logging/master.svg)](https://travis-ci.org/bdfoster/nomatic-logging)
[![Coverage Status](https://img.shields.io/coveralls/bdfoster/nomatic-logging/master.svg)](https://coveralls.io/github/bdfoster/nomatic-logging)
[![Code Climate](https://img.shields.io/codeclimate/github/bdfoster/nomatic-logging/badges/gpa.svg)](https://codeclimate.com/github/bdfoster/nomatic-logging) 
[![David dependencies](https://img.shields.io/david/bdfoster/nomatic-logging.svg)](https://david-dm.org/bdfoster/nomatic-logging)
[![David devDependencies](https://img.shields.io/david/dev/bdfoster/nomatic-logging.svg)](https://david-dm.org/bdfoster/nomatic-logging?type=dev)
[![License](https://img.shields.io/github/license/bdfoster/nomatic-logging.svg)](https://github.com/bdfoster/nomatic-logging/blob/master/LICENSE)

**Get serious about logging.** This library takes the best concepts of
[winston](https://github.com/winstonjs/winston) and [bunyan](https://github.com/trentm/node-bunyan) to create a flexible
yet elegant logging solution for any Node.js library or application. You decide what to do with generated logs by using
the included transports or creating your own, very easily. You can even decide how to manage logs from your project's
dependencies (if they are using this library, of course). A log doesn't have to be just a message, either. You can
data to the log message or have a message generated for you from the data via templates.

## Goals
* **Reliable**: It should fail predictably, and with valid cause. Log data is sensitive and important to determining the
status of the dependent application. This is done with extensive unit and integration testing along with proper
semantic versioning.
* **Flexible**: Each dependent package will use this in a different way. Design it in a way that will fit most use 
cases.
* **Elegant**: It should be easy to get started, yet support complex use cases when needed.
* **Fast**: Logging is boring, but essential. Do what we need to do, quickly, and get out of the way.

## Installation
You can install from [npm](https://www.npmjs.com/package/nomatic-logging) by doing:
```bash
npm install --save nomatic-logging
```

## Basic Usage
To get the default ```Logger```:
```javascript
const logger = require('nomatic-logging');
```
...which is equivalent to (if the namespace is not already taken):
```javascript
const Logger = require('nomatic-logging').Logger;
const transport = require('nomatic-logging').transport;
const logger = new Logger('root', {
    transports: [
        new transport.Console({
            level: 'info'
        })
    ]
});
```
Now, ```logger``` has a name of ```root``` and a way to send logs of level ```info``` and above to the console.

Then, to use it:
```javascript
logger.info('test');
// with data:
logger.info('test', {
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

To listen for all entries generated on `logger`:
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
const Transport = require('nomatic-logging').Transport;
class DatabaseTransport extends Transport {
    public execute(entry) {
        /// do something here
    }
}

const myTransport = new DatabaseTransport({
    level: 'debug'
});
```
You can send log entries to a database, a file, a remote server, whatever you want. This is where `nomatic-logging`
becomes very powerful, and not just a complicated replacement for `console.log()`.

You can then subscribe `myTransport` to a logger:
```javascript
logger.use(myTransport);
```

A log `entry` object looks like this:
```typescript
interface Entry {
  namespace?: string;
  level: string;
  message: string;
  createdAt: Date;
  hostname: string;
  data?: Object;
}
```
As you can see, the only two properties that are optional are `namespace` and `data`. `namespace` is optional because
it is optional in the `Logger` class. You can use the `Logger` class directly, and potentially export it as part of your
library or module:
```javascript
const Logger = logging.Logger;
module.exports.logger = new Logger();
```
The `Logger` class uses no transport(s) by default. You can specify one (or more) when instantiating or do:
```javascript
module.exports.logger.configure({
    transports: [
        logging.transport.console(),
        logging.transport.create({
            level: 'debug',
            handle(entry) {
                // do something with the log entry
            }
        })
    ] 
});
```
This will override properties at a top-level basis (i.e. if you specify `transports`, any other transports specified
will no longer be used by the logger).

Anything you can configure via `configure`, you can pass on instantiation:
```javascript
const myLogger = new Logger({
    transports: [
        logging.transport.console(),
        logging.transport.create({
            level: 'debug',
            handle(entry) {
                // do something with log entry
            }
        })
    ]
});
```
A logger can also have child loggers:
```javascript
logger.create('app');
```
...which have all the same levels and transports of the parent. If you try to `create` another logger with the same name
on this parent, it will throw an exception. When you `configure` the parent, the parent does
the same to all child loggers.

Loggers also have a `get` method, which will either return a logger or create one if it does not exist:
```javascript
logger.get('app') // returns the previously created Logger instance of the same name
logger.get('app2') // `create`s then returns a Logger instance with `name` of "app2"
```

## TypeScript
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
* Make usable in both Node.js and the browser (currently only supported in Node.js)
* Add more transports (either included in the main project or as plugins), including:
  - HTTP (sending log entries via JSON or text to a remote server)
  - File (with log-rotate capabilities)
  - Node.js streams
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
