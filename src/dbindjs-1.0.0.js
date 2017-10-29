/*
 DBindJS, data binding for Javascript
 http://www.dbindjs.com
 Copyright (C) 2017 IOTU NICOLAE
 nicolae.g.iotu@gmail.com
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.
 
 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see http://www.gnu.org/licenses/.
 
 To date DBindJS has unique, original and natural Javascript code, structure and strategy.
 If for any reason another type of licence is required, or a custom version is required please contact the author.
 
 Should you use DBindJS code, structure and/or strategy in other projects,
 appart from AGPL-3.0 requirements, you are kindly requested to link back to DBindJS
 on the web http://www.dbindjs.com, on GitHub https://github.com/NicolaeIotu/DBindJS, 
 or provide public online explanations about the way DBindJS was used in your code.
 
 Minified version of DBindJS created with YUI Compressor ( https://yui.github.io/yuicompressor/ ).
 Javascript documentation created with JSDoc ( http://usejsdoc.org ).
 Website created mostly with MkDocs ( http://www.mkdocs.org ).
 */




// DBindJS is strict mode compatible. Minified version does not enable by default strict mode
'use strict';

// check environment
var nonWindow = typeof window === 'undefined',
	nodeEnv = typeof require !== 'undefined';

// the main and only class of DBindJS
var dbind = function () {
	// throughout the project special terms have the following meaning:
	// 
	// the bindHolder carries the runtime settings and info required by DBindJS; default values are dbind for type and instance for instance
	// when specified the bindHolder must be an object/namespace to carry DBindJS runtime settings and info.
	// 
	// the bindingPoolDescriptor is an object which can either define binding relations, or alter values of properties in binding relations
	// with the intention of triggering the bindings.
	// 
	// the typeCarrier is the object responsible for carrying the definitions of properties, methods and pseudo methods
	var bindHolder, bindingPoolDescriptor, typeCarrier, argsLen = arguments.length, args0 = arguments[0];

	// arguments check
	if (argsLen === 0) {
		throw new TypeError('Expecting at least an argument.');
	} else if (argsLen === 1) {
		if (typeof args0 !== 'object') {
			throw new TypeError('Expecting at least an argument.');
		} else {
			if (nonWindow) {
				bindHolder = this || dbind;
			} else bindHolder = this === window ? dbind : this || dbind;

			bindingPoolDescriptor = args0;
			typeCarrier = dbind.prototype;
		}
	} else if (argsLen >= 2) {
		var args1 = arguments[1];
		if (typeof args0 !== 'object') {
			throw new TypeError('First argument must be an object.');
		} else if (typeof args1 !== 'object') {
			throw new TypeError('The second argument must be an object.');
		} else {
			if (!Object.isExtensible(args0) || Object.isFrozen(args0) || Object.isSealed(args0)) {
				throw new TypeError('Make sure the target object is extensible, not frozen and not sealed.');
			} else {
				bindHolder = args0;
				bindingPoolDescriptor = args1;
				typeCarrier = dbind.prototype;
			}
		}
	}

	var props = Object.keys(bindingPoolDescriptor), propsLen = props.length;

	// detect binding definition, or update of values
	if (propsLen === 0) {
		throw new TypeError('Binding descriptor object is empty, or properties are not enumerable.');
	} else {
		var hasFunction = false, i = 0, propName, propValue;
		while (i < props.length) {
			// detected binding definition
			if (hasFunction) {
				propName = props[i];
				propValue = bindingPoolDescriptor[propName];

				// check for critical properties
				if (!Object.prototype.hasOwnProperty.call(bindHolder, 'propstore') ||
					!Object.prototype.hasOwnProperty.call(bindHolder, 'settings')) {
					typeCarrier.defaultRuntime(bindHolder);
				}

				// add binding function and basic properties
				if (typeof propValue === 'function') {
					typeCarrier.addData(bindHolder, propName, propValue, props);
				} else {
					typeCarrier.addData(bindHolder, propName, propValue);
				}

				i++;
			} else {
				if (typeof bindingPoolDescriptor[props[i]] === 'function') {
					hasFunction = true;
					i = 0;
				} else {
					i++;
				}
			}
		}

		// detected update of values
		if (!hasFunction) {
			for (i = 0; i < propsLen; i++) {
				propName = props[i];

				// forbid non registered properties
				if (!Object.prototype.hasOwnProperty.call(bindHolder.bindstore, propName)) return;

				// operate valid library properties
				bindHolder.bindstore[propName] = bindingPoolDescriptor[propName];
			}

			// while paused no updates to be performed
			if (bindHolder.settings.pause) return;


			// at this point, if bindHolder.settings.mergeUpdates is enabled
			// , typeCarrier.updateQueue is filled and unique (handled in updateDataBindings)
			if (bindHolder.settings.mergeUpdates) {
				typeCarrier.runUpdateQueue(bindHolder);
			}
		}
	}
};

// finalise class definition
dbind.prototype = Object.create(Object.prototype);
dbind.prototype.constructor = dbind;

// PROTOTYPE properties and pseudo methods
(function () {
	// essential internals 
	Object.defineProperty(this, 'explicitDefaults', {
		configurable: false,
		enumerable: false,
		get: function () {
			return(function () {
				return({
					value: arguments[0],
					configurable: false,
					enumerable: false,
					writable: false
				});
			});
		}
	});

	// essential internals 
	Object.defineProperty(this, 'explicitNonConfigurable', {
		configurable: false,
		enumerable: false,
		get: function () {
			return(function () {
				return({
					value: arguments[0],
					configurable: false,
					enumerable: true,
					writable: true
				});
			});
		}
	});

	// non runtime settings
	Object.defineProperties(this, {
		// used for integrity check only (value liable to change in future versions)
		storeMemberKeys: this.explicitDefaults((["dependencies", "previousValue", "value"]).sort().toString())
	});


	//////////// PSEUDO METHODS ////////////
	Object.defineProperties(this, {

		//arguments[0]: bindHolder
		"defaultRuntime": {
			configurable: false,
			enumerable: false,
			get: function () {
				return(function () {
					Object.defineProperties(arguments[0], {
						settings: this.explicitNonConfigurable({
							mergeUpdates: true,
							pause: false
						}),
						updateQueue: this.explicitNonConfigurable([]),
						bindstore: this.explicitNonConfigurable({}),
						propstore: this.explicitNonConfigurable({})
					});
				});
			}
		},

		//arguments[0]: bindHolder
		"runUpdateQueue": {
			configurable: false,
			enumerable: false,
			get: function () {
				return(function () {
					var bindHolder = arguments[0];

					if (!(bindHolder.updateQueue instanceof Array)) {
						throw new TypeError("Error with 'runUpdateQueue': unexpected format for 'updateQueue'");
					}

					var updLen = bindHolder.updateQueue.length;

					//remove the binding from queue and execute it
					for (var j = 0; j < updLen; j++) {
						bindHolder.updateQueue.shift()();
					}
				});
			}
		},

		//arguments[0]: bindHolder
		//arguments[1]: propName
		//arguments[2]: propValue
		//arguments[3]: dependencies (optional array, mandatory when adding bindings)
		"addData": {
			configurable: false,
			enumerable: false,
			get: function () {
				return(function () {
					var bindHolder, typeCarrier, propName, propValue, dependencies,
						addsBindings = arguments.length === 4;
					function tte() {
						throw new TypeError('@addData');
					}

					if ((typeof arguments[0] === 'object' || arguments[0] === dbind) && typeof arguments[1] === 'string') {
						bindHolder = arguments[0];
						if (Object.prototype.hasOwnProperty.call(bindHolder, 'propstore') &&
							Object.prototype.hasOwnProperty.call(bindHolder, 'bindstore')) {
							typeCarrier = this;
							propName = arguments[1].toString();
							propValue = arguments[2];
							if (addsBindings) {
								if (arguments[3] instanceof Array && arguments[3].length) {
									dependencies = arguments[3];
								} else {
									tte();
								}
							}
						} else {
							tte();
						}
					} else {
						tte();
					}

					// delete first if overwritting
					if (Object.prototype.hasOwnProperty.call(bindHolder.propstore, propName)) {
						delete bindHolder.propstore[propName];
						delete bindHolder.bindstore[propName];
					}

					// add to propstore
					Object.defineProperties(bindHolder.propstore[propName] = {} /*configurable, enumerable, writable*/,
						{
							value: this.explicitNonConfigurable(addsBindings ? propValue.bind(bindHolder.bindstore) : propValue),
							previousValue: this.explicitNonConfigurable(addsBindings ? null : propValue),
							dependencies: this.explicitNonConfigurable(addsBindings ? dependencies : null)
						});

					// add to bindstore
					Object.defineProperty(bindHolder.bindstore, propName, {
						configurable: true,
						enumerable: true,
						get: (function () {
							return(bindHolder.propstore[this].value);
						}).bind(propName),
						set: (function (value) {
							// is bindHolder.propstore[this] in the expected format?
							if (Object.getOwnPropertyNames(bindHolder.propstore[this]).sort().toString() !== typeCarrier.storeMemberKeys) {
								console.log('Unexpected format for propstore.');
							} else {
								// only act if value different then the previousValue?
								if (value !== bindHolder.propstore[this].value) {
									// assign previous value
									bindHolder.propstore[this].previousValue = bindHolder.propstore[this].value;
									// assign value
									bindHolder.propstore[this].value = value;

									// update
									//important! this.toString() in non strict mode
									typeCarrier.updateDataBindings(bindHolder, this.toString());
								}
							}
						}).bind(propName)
					});
				})
			}
		},

		//arguments[0]: bindHolder
		//arguments[1]: propName
		"updateDataBindings": {
			configurable: false,
			enumerable: false,
			get: function () {
				return(function () {
					if (arguments.length !== 2 ||
						!(typeof arguments[0] === 'object' || arguments[0] === dbind) ||
						typeof arguments[1] !== 'string') {
						throw new TypeError("'updateDataBindings' unexpected arguments.");
					}

					var bindHolder = arguments[0],
						// important! arguments[1].toString()
						// incoming format e.g. String {0: "v", length: 1, [[PrimitiveValue]]: "v"}
						pSeek = arguments[1].toString(),
						bhkeys = Object.keys(bindHolder.propstore),
						bhkeysLen = bhkeys.length,
						pName, ppp, dpd;

					// optimisation feature: multiple updates of basic properties in a binding pool
					// trigger the binding only once per call to constructor/update method)
					try {
						for (var i = 0; i < bhkeysLen; i++) {
							pName = bhkeys[i];
							ppp = bindHolder.propstore[pName];
							dpd = ppp.dependencies;

							if (dpd !== null && dpd.indexOf(pSeek) !== -1) {
								// push bindings who need update in an unique queue array (optimisation feature)
								if (bindHolder.settings.mergeUpdates) {
									if (bindHolder.updateQueue.indexOf(ppp.value) === -1) {
										bindHolder.updateQueue.push(ppp.value);
									}
								} else {
									// , or directly call the binding if mergeUpdates false
									ppp.value();
								}
							}
						}

						// prevent repeated calls e.g. refresh, refresh, refresh
						bindHolder.propstore[pSeek].previousValue = bindHolder.propstore[pSeek].value;
					} catch (e) {
						console.log("Error while updating bindings depending on " + pSeek + " - " + e.message);
					}
				});
			}
		},

		// no arguments -> reset dbind
		// arguments[0] -> reset arguments[0]
		"reset": {
			configurable: false,
			enumerable: false,
			get: function () {
				return(function () {
					var bindHolder = arguments[0] || dbind,
						typeCarrier = this || dbind.prototype;

					if (!Object.prototype.hasOwnProperty.call(bindHolder, 'settings')) {
						throw new TypeError("'Reset' called on incompatible object.");
					}
					typeCarrier.defaultRuntime(bindHolder);
				});
			}
		},

		// no arguments -> reset dbind
		// arguments[0] -> pause arguments[0]
		"pause": {
			configurable: false,
			enumerable: false,
			get: function () {
				return(function () {
					var bindHolder = arguments[0] || dbind;
					if (!Object.prototype.hasOwnProperty.call(bindHolder, 'settings')) {
						throw new TypeError("'Pause' called on incompatible object.");
					}
					bindHolder.settings.pause = true;
				});
			}
		},

		// no arguments -> reset dbind
		// arguments[0] -> resume arguments[0]
		"resume": {
			configurable: false,
			enumerable: false,
			get: function () {
				return(function () {
					var bindHolder = arguments[0] || dbind,
						typeCarrier = this || dbind.prototype;

					if (!Object.prototype.hasOwnProperty.call(bindHolder, 'settings')) {
						throw new TypeError("'Resume' called on incompatible object.");
					}
					bindHolder.settings.pause = false;
					typeCarrier.refresh(bindHolder);
				});
			}
		},

		// used when the updating is paused with 'pause'
		// , but can be called also after updating manually the propstore
		// 
		// no arguments -> reset dbind
		// arguments[0] -> refresh arguments[0]
		"refresh": {
			configurable: false,
			enumerable: false,
			get: function () {
				return(function () {
					var bindHolder, typeCarrier, bhkeys, bhkeysLen, ppp, pName, originalPauseStatus;

					bindHolder = arguments[0] || dbind;
					typeCarrier = this || dbind.prototype;
					originalPauseStatus = bindHolder.settings.pause;

					//temporary enable updating
					bindHolder.settings.pause = false;

					try {
						bhkeys = Object.keys(bindHolder.propstore);
						bhkeysLen = bhkeys.length;
						for (var i = 0; i < bhkeysLen; i++) {
							pName = bhkeys[i];
							ppp = bindHolder.propstore[pName];
							if (ppp.dependencies === null && ppp.value !== ppp.previousValue) {
								typeCarrier.updateDataBindings(bindHolder, pName);
							}
						}

						if (bindHolder.settings.mergeUpdates) {
							typeCarrier.runUpdateQueue(bindHolder);
						}
					} catch (e) {
						console.log('Error with "refresh": ', e.message);
					} finally {
						// set pause to original value
						bindHolder.settings.pause = originalPauseStatus;
					}
				});
			}
		},

		// shortcut to class constructor
		"update": {
			configurable: false,
			enumerable: false,
			get: function () {
				return(function () {
					this.constructor.apply(this, arguments);
				});
			}
		}
	});
}).call(dbind.prototype);

// Below methods and properties exist only when using the type dbind (when using the class).
// When using an instance of dbind (new dbind), the shortcuts below are not created
// , but their targets exist in the prototype chain (inherited).
// In this way it's ok to call e.g. .update for both type and instance.
(function () {
	var tp = this.prototype;

	// deploy runtime settings on dbind
	Object.defineProperties(this, {
		"settings": tp.explicitNonConfigurable({
			"mergeUpdates": true,
			"pause": false
		}),
		"updateQueue": tp.explicitNonConfigurable([]),
		"bindstore": tp.explicitNonConfigurable({}),
		"propstore": tp.explicitNonConfigurable({})
	});


	// shortcuts
	this.update = function () {
		this.apply(tp, arguments);
	};
	this.reset = function () {
		this.prototype.reset.apply(tp, arguments);
	};
	this.pause = function () {
		this.prototype.pause.apply(tp, arguments);
	};
	this.refresh = function () {
		this.prototype.refresh.apply(tp, arguments);
	};
	this.resume = function () {
		this.prototype.resume.apply(tp, arguments);
	};
}).call(dbind);

// additional protection feature
Object.seal(dbind.prototype);
Object.seal(dbind);

// NodeJS exports
if (nodeEnv) {
	// natural javascript structure enables single export
	exports.dbind = dbind;

	// NodeJS only test
	exports.testNodeLib = function () {
		console.log('DBindJS running A OK on NodeJS.');
	};
}
