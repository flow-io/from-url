from-url
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> Provides a stream interface for fetching a remote resource.


### Installation

``` bash
$ npm install flow-from-url
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


### Usage

``` javascript
var stream = require( 'flow-from-url' );
```

#### stream( [options] )

...TODO.

``` javascript

```

To set the stream `options`,

``` javascript
var opts = {
	
};

// TODO: demo use
```



#### stream.factory( [options] )

Returns a reusable stream factory. The factory method ensures streams are configured identically by using the same set of provided `options`.

``` javascript
var opts = {
	
};

var factory = require( 'flow-from-url' ).factory( opts );

// TODO: demo use
```


#### stream.objectMode( [options] )

This method is a convenience function to create streams which always operate in `objectMode`. The method will __always__ override the `objectMode` option in `options`.

``` javascript
var stream = require( 'flow-from-url' ).objectMode;

// TODO: demo use
```




### Examples

``` javascript
var createStream = require( 'flow-from-url' );

// Create a readable stream:
var readableStream = createStream();

// Pipe the data...
readableStream.pipe( process.stdout );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


---
## CLI


### Installation

To use the module as a general utility, install the module globally

``` bash
$ npm install -g flow-from-url
```


### Usage

``` bash
Usage: flow-from-url [options] [url]

Options:

  -h,   --help                 Print this message.
  -V,   --version              Print the package version.
  -enc, --encoding <encoding>  Set the string encoding of chunks. Default: 
                               null.
  -hwm, --highwatermark        Specify how much data can be buffered into
                               memory before applying back pressure. Default:
                               16kb.
  -nho, --no-halfopen          Close the stream when the writable stream ends.
                               Default: false.
  -nds, --no-decodestrings     Prevent strings from being converted into
                               buffers before streaming to destination.
                               Default: false.
  -om,  --objectmode           Stream individual objects rather than buffers.
                               Default: false.
```

The `flow-from-url` command is available as a [standard stream](http://en.wikipedia.org/wiki/Pipeline_%28Unix%29).

``` bash
$ flow-from-url | <stdin>
``` 


### Examples

``` bash
$ flow-from-url 'https://google.com' | awk '{print $1}'
```

For local installations, modify the above command to point to the local installation directory; e.g., 

``` bash
$ ./node_modules/.bin/flow-from-url 'https://google.com' | awk '{print $1}'
```

To read from an example data file, navigate to the top-level module directory and run

``` bash
$ flow-from-url ./examples/cli.txt | awk '{print $1}'
```


---
## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT). 


## Copyright

Copyright &copy; 2015. The [Flow.io](https://github.com/flow-io) Authors.


[npm-image]: http://img.shields.io/npm/v/flow-from-url.svg
[npm-url]: https://npmjs.org/package/flow-from-url

[travis-image]: http://img.shields.io/travis/flow-io/from-url/master.svg
[travis-url]: https://travis-ci.org/flow-io/from-url

[coveralls-image]: https://img.shields.io/coveralls/flow-io/from-url/master.svg
[coveralls-url]: https://coveralls.io/r/flow-io/from-url?branch=master

[dependencies-image]: http://img.shields.io/david/flow-io/from-url.svg
[dependencies-url]: https://david-dm.org/flow-io/from-url

[dev-dependencies-image]: http://img.shields.io/david/dev/flow-io/from-url.svg
[dev-dependencies-url]: https://david-dm.org/dev/flow-io/from-url

[github-issues-image]: http://img.shields.io/github/issues/flow-io/from-url.svg
[github-issues-url]: https://github.com/flow-io/from-url/issues