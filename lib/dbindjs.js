'use strict'

/*
 dbindjs, data binding for Javascript
 http://www.dbindjs.com
 Copyright (C) 2017-2023 IOTU NICOLAE
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
 */

// check environment
// eslint-disable-next-line no-new-func
const isBrowser = new Function('try {return this===window;}catch(e){return false;}')()
const hasOwnProperty = Object.prototype.hasOwnProperty

// class dbind
const dbind = function () {
  // throughout the project special terms have the following meaning:
  //
  // the bindHolder carries the runtime settings and info required by **dbindjs**; default values are dbind for type and instance for instance
  // when specified the bindHolder must be an object/namespace to carry **dbindjs** runtime settings and info.
  //
  // the bindingPoolDescriptor is an object which can either define binding relations, or alter values of properties in binding relations
  // with the intention of triggering the bindings.
  //
  // the typeCarrier is the object responsible for carrying the definitions of properties, methods and pseudo methods
  let bindHolder
  let bindingPoolDescriptor
  let typeCarrier
  const argsLen = arguments.length
  const args0 = arguments[0]

  // arguments check
  if (argsLen === 0) {
    throw new TypeError('Expecting at least an argument.')
  } else if (argsLen === 1) {
    if (typeof args0 !== 'object' || args0 === null) {
      throw new TypeError('Expecting at least an argument.')
    } else {
      if (!isBrowser) {
        bindHolder = this || dbind
      } else bindHolder = this === window ? dbind : this || dbind

      bindingPoolDescriptor = args0
      typeCarrier = dbind.prototype
    }
  } else if (argsLen >= 2) {
    const args1 = arguments[1]
    if (typeof args0 !== 'object' || args0 === null) {
      throw new TypeError('First argument must be an object.')
    } else if (typeof args1 !== 'object' || args1 === null) {
      throw new TypeError('The second argument must be an object.')
    } else {
      if (!Object.isExtensible(args0) || Object.isFrozen(args0) || Object.isSealed(args0)) {
        throw new TypeError('Make sure the target object is extensible, not frozen and not sealed.')
      } else {
        bindHolder = args0
        bindingPoolDescriptor = args1
        typeCarrier = dbind.prototype
      }
    }
  }

  const props = Object.keys(bindingPoolDescriptor)
  const propsLen = props.length

  // detect binding definition, or update of values
  if (propsLen === 0) {
    throw new TypeError('Binding descriptor object is empty, or properties are not enumerable.')
  } else {
    let hasFunction = false
    let i = 0
    let propName
    let propValue
    while (i < props.length) {
      // detected binding definition
      if (hasFunction) {
        propName = props[i]
        propValue = bindingPoolDescriptor[propName]

        // check for critical properties
        if (!hasOwnProperty.call(bindHolder, 'propstore') ||
          !hasOwnProperty.call(bindHolder, 'settings')) {
          typeCarrier.defaultRuntime(bindHolder)
        }

        // add binding function and basic properties
        if (typeof propValue === 'function') {
          typeCarrier.addData(bindHolder, propName, propValue, props)
        } else {
          typeCarrier.addData(bindHolder, propName, propValue)
          typeCarrier.addData(bindHolder, propName, propValue)
        }

        i++
      } else {
        if (typeof bindingPoolDescriptor[props[i]] === 'function') {
          hasFunction = true
          i = 0
        } else {
          i++
        }
      }
    }

    // detected update of values
    if (!hasFunction) {
      for (i = 0; i < propsLen; i++) {
        propName = props[i]

        // forbid non registered properties
        if (!hasOwnProperty.call(bindHolder.bindstore, propName)) {
          return
        }

        // operate valid library properties
        bindHolder.bindstore[propName] = bindingPoolDescriptor[propName]
      }

      // while paused no updates to be performed
      if (bindHolder.settings.pause) {
        return
      }

      // at this point, if bindHolder.settings.mergeUpdates is enabled
      // , typeCarrier.updateQueue is filled and unique (handled in updateDataBindings)
      if (bindHolder.settings.mergeUpdates) {
        typeCarrier.runUpdateQueue(bindHolder)
      }
    }
  }
}

// finalize class definition
dbind.prototype = Object.create(Object.prototype)
dbind.prototype.constructor = dbind;

// dbind.prototype properties and methods
(function () {
  // essential internals
  Object.defineProperty(this, 'explicitDefaults', {
    configurable: false,
    enumerable: false,
    get: function () {
      return function (obj) {
        return ({
          value: obj,
          configurable: false,
          enumerable: false,
          writable: false
        })
      }
    }
  })

  // essential internals
  Object.defineProperty(this, 'explicitNonConfigurable', {
    configurable: false,
    enumerable: false,
    get: function () {
      return function (obj) {
        return ({
          value: obj,
          configurable: false,
          enumerable: true,
          writable: true
        })
      }
    }
  })

  // non runtime settings
  Object.defineProperties(this, {
    storeMemberKeys: this.explicitDefaults((['dependencies', 'previousValue', 'value']).sort().toString())
  })

  /// ///////// PSEUDO METHODS ////////////
  Object.defineProperties(this, {
    // bindHolder An object on which to attach the binding components. This object is known as the bind holder.
    defaultRuntime: {
      configurable: false,
      enumerable: false,
      get: function () {
        return function (bindHolder) {
          Object.defineProperties(bindHolder, {
            settings: this.explicitNonConfigurable({
              mergeUpdates: true,
              pause: false
            }),
            updateQueue: this.explicitNonConfigurable([]),
            bindstore: this.explicitNonConfigurable({}),
            propstore: this.explicitNonConfigurable({})
          })
        }
      }
    },

    // bindHolder The object holding the bindings.
    runUpdateQueue: {
      configurable: false,
      enumerable: false,
      get: function () {
        return function (bindHolder) {
          if (!(Array.isArray(bindHolder.updateQueue))) {
            throw new TypeError('Error with \'runUpdateQueue\': unexpected format for \'updateQueue\'')
          }
          const updLen = bindHolder.updateQueue.length

          // remove the binding from queue and execute it
          for (let j = 0; j < updLen; j++) {
            const nextBinding = bindHolder.updateQueue.shift()
            if (typeof nextBinding === 'function') {
              nextBinding()
            }
          }
        }
      }
    },

    // bindHolder The object holding the bindings.
    // propertyName A name for the property being added to the binding pool.
    // propertyValue A value for the property being added to the binding pool.
    // dependencies An array containing the names of the properties which impact 'propertyName'.
    addData: {
      configurable: false,
      enumerable: false,
      get: function () {
        return function (bindHolder, propertyName, propertyValue, dependencies) {
          let typeCarrier
          let propName
          let propValue
          const addsBindings = arguments.length === 4

          if ((typeof bindHolder === 'object' || bindHolder === dbind) &&
            bindHolder !== null && typeof arguments[1] === 'string') {
            if (hasOwnProperty.call(bindHolder, 'propstore') &&
              hasOwnProperty.call(bindHolder, 'bindstore')) {
              typeCarrier = this
              propName = arguments[1].toString()
              propValue = arguments[2]
              if (addsBindings) {
                if (!(Array.isArray(dependencies) && dependencies.length)) {
                  throw new TypeError('addData: invalid dependencies - ' + dependencies)
                }
              }
            } else {
              throw new TypeError('addData: missing propstore and/or bindstore')
            }
          } else {
            throw new TypeError('addData: invalid arguments')
          }

          // delete first if overwriting
          if (hasOwnProperty.call(bindHolder.propstore, propName)) {
            delete bindHolder.propstore[propName]
            delete bindHolder.bindstore[propName]
          }

          // add to propstore
          Object.defineProperties(bindHolder.propstore[propName] = {} /* configurable, enumerable, writable */,
            {
              value: this.explicitNonConfigurable(addsBindings ? propValue.bind(bindHolder.bindstore) : propValue),
              previousValue: this.explicitNonConfigurable(addsBindings ? null : propValue),
              dependencies: this.explicitNonConfigurable(addsBindings ? dependencies : null)
            })

          // add to bindstore
          Object.defineProperty(bindHolder.bindstore, propName, {
            configurable: true,
            enumerable: true,
            get: function () {
              return (bindHolder.propstore[this].value)
            }.bind(propName),
            set: function (value) {
              // is bindHolder.propstore[this] in the expected format?
              if (Object.getOwnPropertyNames(bindHolder.propstore[this]).sort().toString() !== typeCarrier.storeMemberKeys) {
                console.warn('Unexpected format for propstore.')
              } else {
                // only act if value different from the previousValue?
                if (value !== bindHolder.propstore[this].value) {
                  // assign previous value
                  bindHolder.propstore[this].previousValue = bindHolder.propstore[this].value
                  // assign value
                  bindHolder.propstore[this].value = value

                  // update
                  // important! this.toString() in non-strict mode
                  typeCarrier.updateDataBindings(bindHolder, this.toString())
                }
              }
            }.bind(propName)
          })
        }
      }
    },

    // arguments[0]: bindHolder
    // arguments[1]: propName
    updateDataBindings: {
      configurable: false,
      enumerable: false,
      get: function () {
        return function () {
          if (arguments.length !== 2 ||
            !(typeof arguments[0] === 'object' || arguments[0] === dbind) ||
            typeof arguments[1] !== 'string') {
            throw new TypeError('\'updateDataBindings\' unexpected arguments.')
          }

          const bindHolder = arguments[0]
          // important! arguments[1].toString()
          // incoming format e.g. String {0: "v", length: 1, [[PrimitiveValue]]: "v"}
          const pSeek = arguments[1].toString()
          const bhkeys = Object.keys(bindHolder.propstore)
          const bhkeysLen = bhkeys.length
          let pName, ppp, dpd

          // optimisation feature: multiple updates of basic properties in a binding pool
          // trigger the binding only once per call to constructor/update method)
          try {
            for (let i = 0; i < bhkeysLen; i++) {
              pName = bhkeys[i]
              ppp = bindHolder.propstore[pName]
              dpd = ppp.dependencies

              if (dpd !== null && dpd.indexOf(pSeek) !== -1) {
                // push bindings who need update in an unique queue array (optimisation feature)
                if (bindHolder.settings.mergeUpdates) {
                  if (bindHolder.updateQueue.indexOf(ppp.value) === -1) {
                    bindHolder.updateQueue.push(ppp.value)
                  }
                } else {
                  // , or directly call the binding if mergeUpdates false
                  ppp.value()
                }
              }
            }

            // prevent repeated calls e.g. refresh, refresh, refresh
            bindHolder.propstore[pSeek].previousValue = bindHolder.propstore[pSeek].value
          } catch (e) {
            console.error('Error while updating bindings depending on ' + pSeek + ' - ' + e.message)
          }
        }
      }
    },

    // no arguments -> reset dbind
    // arguments[0] -> reset arguments[0]
    reset: {
      configurable: false,
      enumerable: false,
      get: function () {
        return function () {
          const bindHolder = arguments[0] || dbind
          const typeCarrier = this || dbind.prototype

          if (!hasOwnProperty.call(bindHolder, 'settings')) {
            throw new TypeError('\'Reset\' called on incompatible object.')
          }
          typeCarrier.defaultRuntime(bindHolder)
        }
      }
    },

    // no arguments -> reset dbind
    // arguments[0] -> pause arguments[0]
    pause: {
      configurable: false,
      enumerable: false,
      get: function () {
        return function () {
          const bindHolder = arguments[0] || dbind
          if (!hasOwnProperty.call(bindHolder, 'settings')) {
            throw new TypeError('\'Pause\' called on incompatible object.')
          }
          bindHolder.settings.pause = true
        }
      }
    },

    // no arguments -> reset dbind
    // arguments[0] -> resume arguments[0]
    resume: {
      configurable: false,
      enumerable: false,
      get: function () {
        return function () {
          const bindHolder = arguments[0] || dbind
          const typeCarrier = this || dbind.prototype

          if (!hasOwnProperty.call(bindHolder, 'settings')) {
            throw new TypeError('\'Resume\' called on incompatible object.')
          }
          bindHolder.settings.pause = false
          typeCarrier.refresh(bindHolder)
        }
      }
    },

    // used when the updating is paused with 'pause'
    // , but can be called also after updating manually the propstore
    //
    // no arguments -> reset dbind
    // arguments[0] -> refresh arguments[0]
    refresh: {
      configurable: false,
      enumerable: false,
      get: function () {
        return function () {
          let bhkeys, bhkeysLen, ppp, pName

          const bindHolder = arguments[0] || dbind
          const typeCarrier = this || dbind.prototype
          const originalPauseStatus = bindHolder.settings.pause

          // temporary enable updating
          bindHolder.settings.pause = false

          try {
            bhkeys = Object.keys(bindHolder.propstore)
            bhkeysLen = bhkeys.length
            for (let i = 0; i < bhkeysLen; i++) {
              pName = bhkeys[i]
              ppp = bindHolder.propstore[pName]
              if (ppp.dependencies === null && ppp.value !== ppp.previousValue) {
                typeCarrier.updateDataBindings(bindHolder, pName)
              }
            }

            if (bindHolder.settings.mergeUpdates) {
              typeCarrier.runUpdateQueue(bindHolder)
            }
          } catch (e) {
            console.error('Error with "refresh": ', e.message)
          } finally {
            // set pause to original value
            bindHolder.settings.pause = originalPauseStatus
          }
        }
      }
    },

    // shortcut to class constructor
    update: {
      configurable: false,
      enumerable: false,
      get: function () {
        return function () {
          this.constructor.apply(this, arguments)
        }
      }
    }
  })
}).call(dbind.prototype)

// additional protection feature
Object.seal(dbind.prototype)

export {
  dbind
}
