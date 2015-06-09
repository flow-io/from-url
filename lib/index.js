'use strict';

// MODULES //

var Readable = require( 'readable-stream' ).Readable,
	merge = require( 'utils-merge2' )(),
	isObject = require( 'validate.io-object' ),
	isPositive = require( 'validate.io-positive' ),
	request = require( 'request' );


// STREAM //

/**
* FUNCTION: Stream( opts )
*	Readable stream constructor.
*
* @constructor
* @param {Object} opts - Readable stream options
* @param {String} opts.uri - remote resource URI
* @param {Number} [opts.interval=3600000] - defines a poll interval (in milliseconds) for repeatedly querying a remote endpoint
* @returns {Stream} Readable stream
*/
function Stream( opts ) {
	var self;
	if ( !( this instanceof Stream ) ) {
		return new Stream( opts );
	}
	self = this;

	// [0] Make the stream instance a readable stream:
	Readable.call( this, {} );
	this._destroyed = false;

	// [1] Ensure that request options are provided...
	if ( !isObject( opts ) ) {
		throw new TypeError( 'invalid input argument. Options argument must be an object. Value: `' + opts + '`.' );
	}
	// [2] Merge the provided request options into the default options...
	opts = merge( {}, opts );

	// [3] Ensure a valid `interval` option...
	if ( opts.interval ) {
		if ( !isPositive( opts.interval ) ) {
			throw new TypeError( 'invalid option. `interval` option must be a positive number. Option: `' + opts.interval + '`.' );
		}
		this._poll = true;
		this._interval = opts.interval;
		delete opts.interval;
	} else {
		this._interal = 60 * 60 * 1000; // 1hr
	}
	// [4] Ensure that the request method is always `GET`:
	opts.method = 'GET';

	// [5] Cache the request options:
	this._opts = opts;

	// [6] Expose a property for setting and getting the interval...
	Object.defineProperty( this, 'interval', {
		'set': function set( val ) {
			var err;
			if ( !isPositive( val ) ) {
				err = new TypeError( 'invalid value. `interval` must be a positive number. Value: `' + val + '`.' );
				return this.emit( 'error', err );
			}
			this._interval = val;

			// TODO: can setting an interval resume streaming?
		},
		'get': function get() {
			return this._interval;
		},
		'configurable': false,
		'enumerable': true
	});

	// [7] Expose a property for determining if any requests are pending...
	Object.defineProperty( this, 'pending', {
		'get': function get() {
			return this._pending;
		},
		'configurable': false,
		'enumerable': true
	});
	this._pending = 0;

	// [8] Initialize a request cache which is used to track pending requests:
	this._cache = {};

	// [9] Initialize a request count (used for assigning query ids):
	this._rid = 0;

	// [10] Initialize an interval id:
	this._id = null;

	// [11] Add event listeners to keep track of pending queries...
	this.on( 'init', init );
	this.on( 'response', onResponse );

	return this;

	/**
	* FUNCTION: init( evt )
	*	Event listener invoked when initiating a remote endpoint request.
	*
	* @private
	* @param {Object} evt - init event object
	*/
	function init( evt ) {
		self._cache[ evt.rid ] = true;
		self._pending += 1;
		self.emit( 'pending', self._pending );
	} // end FUNCTION init()

	/**
	* FUNCTION: onResponse( evt )
	*	Event listener invoked when a request ends.
	*
	* @private
	* @param {Object} evt - end event object
	*/
	function onResponse( evt ) {
		delete self._cache[ evt.rid ];
		self._pending -= 1;
		self.emit( 'pending', self._pending );
	} // end FUNCTION onResponse()
} // end FUNCTION Stream()

/**
* Create a prototype which inherits from the parent prototype.
*/
Stream.prototype = Object.create( Readable.prototype );

/**
* Set the constructor.
*/
Stream.prototype.constructor = Stream;

/**
* METHOD: _read()
*	Implements the `_read` method to fetch data from a remote endpoint.
*
* @private
*/
Stream.prototype._read = function() {
	var self = this;
	request( this._opts, onResponse );

	function onResponse( error, response, body ) {
		var evt;

		evt = {
			'rid': self._rid,
			'time': Date.now()
		};
		if ( error ) {
			evt.status = 500;
			evt.message = 'Request error. Error encountered while attempting to query the remote endpoint.';
			evt.detail = error;
			return self.emit( 'error', evt );
		}
		if ( response.statusCode !== 200 ) {
			evt.status = response.statusCode;
			evt.message = 'Client error.';
			evt.detail = body;
			return self.emit( 'error', evt );
		}
		self.push( body );
		// self.push( null );
	}
}; // end METHOD _read()

/**
* METHOD: destroy( [error] )
*	Gracefully destroys a stream, providing backwards compatibility.
*
* @param {Object} [error] - optional error message
* @returns {Stream} Stream instance
*/
Stream.prototype.destroy = function( error ) {
	if ( this._destroyed ) {
		return;
	}
	var self = this;
	this._destroyed = true;
	process.nextTick( destroy );

	return this;

	/**
	* FUNCTION: destroy()
	*	Emits a `close` event.
	*
	* @private
	*/
	function destroy() {
		if ( error ) {
			self.emit( 'error', error );
		}
		self.emit( 'close' );
	}
}; // end METHOD destroy()

/**
* METHOD: stop()
*	Stops polling a remote endpoint.
*
* @returns {Stream} Stream instance
*/
Stream.prototype.stop = function() {
	if ( this._id ) {
		clearInterval( this._id );
		this._id = null;
		this.emit( 'stop', null );
	}
	return this;
}; // end METHOD stop()


// OBJECT MODE //

/**
* FUNCTION: objectMode( [options] )
*	Returns a stream with `objectMode` set to `true`.
*
* @param {Object} [options] - Readable stream options
* @returns {Stream} Readable stream
*/
function objectMode( options ) {
	var opts;
	if ( arguments.length ) {
		opts = options;
	} else {
		opts = {};
	}
	opts.objectMode = true;

	// TODO: clean me

	return new Stream( opts );
} // end FUNCTION objectMode()


// FACTORY //

/**
* FUNCTION: streamFactory( [options] )
*	Creates a reusable stream factory.
*
* @param {Object} [options] - Readable stream options
* @returns {Function} stream factory
*/
function streamFactory( options ) {
	var opts;
	if ( arguments.length ) {
		opts = options;
	} else {
		opts = {};
	}
	// TODO: validation


	/**
	* FUNCTION: createStream()
	*	Creates a stream.
	*
	* @returns {Stream} Readable stream
	*/
	return function createStream() {
		return new Stream( opts );
	};
} // end METHOD streamFactory()


// EXPORTS //

module.exports = Stream;
module.exports.objectMode = objectMode;
module.exports.factory = streamFactory;