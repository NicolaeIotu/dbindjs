/**
 * <strong>dbind.prototype</strong> contains all core properties and methods of {@link dbind}.<br/>
 * Except <em>dbind.prototype.storeMemberKeys</em>, all other properties listed here are getter-only protected from
 * inadvertent use, return a function and should be used as methods unless otherwise required by special circumstances.
 * @namespace prototype
 * @since 1.0.0
 * @property {Property/Function} dbind.prototype.addData Advanced use. Getter-only property
 * [dbind.prototype.addData]{@link prototype#addData}.
 * @property {Property/Function} dbind.prototype.defaultRuntime Advanced use. Getter-only property
 * [dbind.prototype.defaultRuntime]{@link prototype#defaultRuntime}.
 * @property {Property/Function} dbind.prototype.explicitDefaults Advanced use. Getter-only property
 * [dbind.prototype.explicitDefaults]{@link prototype#explicitDefaults}.
 * @property {Property/Function} dbind.prototype.explicitNonConfigurable Advanced use. Getter-only property
 * [dbind.prototype.explicitNonConfigurable]{@link prototype#explicitNonConfigurable}.
 * @property {Property/Function} dbind.prototype.pause Getter-only property [dbind.prototype.pause]{@link prototype#pause}.
 * @property {Property/Function} dbind.prototype.refresh Getter-only property [dbind.prototype.refresh]{@link prototype#refresh}.
 * @property {Property/Function} dbind.prototype.reset Getter-only property [dbind.prototype.reset]{@link prototype#reset}.
 * @property {Property/Function} dbind.prototype.resume Getter-only property [dbind.prototype.resume]{@link prototype#resume}.
 * @property {Property/Function} dbind.prototype.runUpdateQueue Advanced use. Getter-only property
 * [dbind.prototype.runUpdateQueue]{@link prototype#runUpdateQueue}.
 * @property {Property/Constant} dbind.prototype.storeMemberKeys Advanced use. See
 * [dbind.prototype.storeMemberKeys]{@link prototype#storeMemberKeys}.
 * @property {Property/Function} dbind.prototype.update Getter-only property [dbind.prototype.update]{@link prototype#update}.
 * @property {Property/Function} dbind.prototype.updateDataBindings Advanced use. Getter-only property
 * [dbind.prototype.updateDataBindings]{@link prototype#updateDataBindings}.
 */
const prototype = function () {}

/**
 * <strong>dbind.prototype.addData</strong><br/>
 * Getter-only property meant for internal or advanced use.<br/>
 * Returns a function through its getter. The return function is normally called internally when setting up a binding pool. All properties and binding functions of a [binding pool descriptor]{@link dbind} are declared using this method.
 * @memberof prototype
 * @readonly
 * @param {object} bindHolder An object (namespace) on which to register <em>propertyName</em>: <em>propertyValue</em>.
 * @param {string} propertyName The name of the property to be defined on <em>bindHolder</em>.
 * @param {any_value} propertyValue A value to be assigned to <em>propertyName</em>. When this value is a function (binding) then <em>dependencies</em> argument must be specified.
 * @param {array=} dependencies An array of property names, normally dependencies of the binding function. When any of these properties change value, the binding function is called, or added to <em>bindHolder.updateQueue</em> while keeping this array unique. Behavior is influenced by runtime setting <em>mergeUpdates</em>.
 * @returns {function}
 * @since 1.0.0
 * @example
 * // the binding pool descriptor
 * const desc = {
 *     a: 1,
 *     v: 2,
 *     t: 1,
 *     k: function () {
 *         let val = this.t / this.v / this.g
 *         console.log('k updated val: ', val)
 *         // ...
 *     },
 *     g: 7,
 *     r: 4
 * }
 *
 * const inst = new dbind(desc) // in this case the bindHolder is inst (instance of dbind)
 *
 * // add new binding function 'custom_binding'
 * inst.addData(inst,
 *     'custom_binding',
 *     function() {
 *         let val = this.a + this.r
 *         console.log('custom_binding updated val: ', val)
 *         // ...
 *     },
 *     ['r', 'a'])
 *
 *
 * // trigger 'custom_binding'
 * inst.update({ a: 3, r: 8 }) // equivalent to inst.constructor({ a: 3, r: 8 })
 * // in console can be noticed that binding function 'k' gets triggered as well
 * // because some of its dependencies (a and r) in the binding pool descriptor 'desc' changed values
 * // This can be avoided. See the third example.
 *
 * @example
 * // notice the binding bool descriptor is missing property g, required by binding function k
 * const desc = {
 *     v: 2,
 *     t: 1,
 *     k: function () {
 *         let a = this.t + this.v + this.g
 *         console.log("k updated 'a' value: ", a)
 *         // ...
 *     }
 * }
 *
 * dbind(desc) // in this case the default bindHolder is dbind (dbind used as type)
 *
 * // add missing property g
 * dbind.prototype.addData(dbind, 'g', 7)
 * // and update the dependencies of k
 * dbind.propstore.k.dependencies.push('g')
 *
 * // trigger the binding
 * dbind({ g: 1 })
 * @example
 * const desc = {
 *     v: 2,
 *     t: 1,
 *     k: function () {
 *         let a = this.t + this.v
 *         console.log("k updated 'a' value: ", a)
 *         // ...
 *     }
 * }
 *
 * dbind(desc)
 *
 * const dp = dbind.prototype
 * // define a binding function in the same binding pool and make it dependable on a lesser number of basic properties
 * dp.addData(dbind, 'x', 2)
 * dp.addData(dbind,
 *     'custom_binding',
 *     function() {
 *         console.log("custom_binding updated 'x' value: ", this.x)
 *         // ...
 *     },
 *  ['x'])
 *
 *
 * // trigger only the initial binding k
 * dbind({t: 11})
 *
 * // trigger only 'custom_binding'
 * dbind({x: 4})
 */
prototype.addData = function (bindHolder, propertyName, propertyValue, dependencies) {}

/**
 * <strong>dbind.prototype.defaultRuntime</strong><br/>
 * Getter-only property meant for internal or advanced use.<br/>
 * Returns a function through its getter. The <em>bindHolder</em> provided as argument to this function gets its DBindJS relevant runtime properties reset to default values. Among others this means that all the bindings defined on the <em>bindHolder</em> (namespace) will be deleted.
 * @memberof prototype
 * @readonly
 * @param {object} bindHolder An object (namespace) to get its DBindJS relevant properties reset to default values.
 * @returns {function}
 * @since 1.0.0
 * @example
 * const desc = {
 *     v: 2,
 *     t: 1,
 *     k: function () {
 *         // ...
 *     }
 * }
 *
 * const inst = new dbind(desc)
 * dbind.pause(inst)
 *
 * const dbindjsRuntimeProps = [inst.bindstore, inst.propstore, inst.settings, inst.updateQueue]
 *
 * dbind.prototype.defaultRuntime(inst)
 *
 * console.log(dbindjsRuntimeProps[0] == inst.bindstore, dbindjsRuntimeProps[0], inst.bindstore) // false ...
 * console.log(dbindjsRuntimeProps[1] == inst.propstore, dbindjsRuntimeProps[1], inst.propstore) // false ...
 * console.log(dbindjsRuntimeProps[2].pause == inst.settings.pause, dbindjsRuntimeProps[2], inst.settings) // false ...
 * console.log(dbindjsRuntimeProps[3] == inst.updateQueue, dbindjsRuntimeProps[3], inst.updateQueue) // false ...
 */
prototype.defaultRuntime = function (bindHolder) {}

/**
 * <strong>dbind.prototype.explicitNonConfigurable</strong><br/>
 * Getter-only property meant for internal or advanced use.<br/>
 * Returns a function through its getter. Call this function with any value as argument to get an object which can be used with <em>Object.defineProperty</em> and <em>Object.defineProperties</em> to create an non-configurable, enumerable and writable object with its value set to the argument provided.
 * @memberof prototype
 * @readonly
 * @param {any_value} value Any value.
 * @example
 * let myobj = {}
 * // myobj.sub1 will be defined as a non-configurable, enumerable and writable empty object
 * Object.defineProperty(myobj, 'sub2', dbind.prototype.explicitNonConfigurable({}))
 *
 * // myobj.sub1 cannot be deleted (TypeError in strict mode)
 * delete myobj.sub2
 * console.log(myobj.sub2)
 *
 * // but can be modified
 * myobj.sub2 = []
 * console.log(myobj.sub2)
 */
prototype.explicitNonConfigurable = function () {}

/**
 * <strong>dbind.prototype.explicitDefaults</strong><br/>
 * Getter-only property meant for internal or advanced use.<br/>
 * Returns a function through its getter. Call this function with any value as argument to get an object which can be used with <em>Object.defineProperty</em> and <em>Object.defineProperties</em> to define an non-configurable, non-enumerable and non-writable object with its value set to the argument provided.
 * @memberof prototype
 * @readonly
 * @param {any_value} value Any value.
 * @example
 * let myobj = {}
 * // myobj.sub1 will be defined as a non-configurable, non-enumerable and non-writable empty object
 * Object.defineProperty(myobj, 'sub1', dbind.prototype.explicitDefaults({}))
 *
 * // myobj.sub1 cannot be deleted (TypeError in strict mode)
 * delete myobj.sub1
 * console.log(myobj.sub1)
 *
 * // or modified
 * myobj.sub1 = 11
 * console.log(myobj.sub1)
 *
 * // but the structure of myobj.sub1 can still be modified
 * myobj.sub1.three = 3
 * console.log(myobj.sub1)
 */
prototype.explicitDefaults = function () {}

/**
 * <strong>dbind.prototype.pause</strong><br/>
 * Returns a function through its getter. Upon calling this function, the updating of bindings is paused for the object (namespace) provided as argument. If argument is not specified the <em>bindHolder</em> defaults to <em>dbind</em> for type, or instance for instance.<br/>
 * The <em>bindHolder</em> is paused by changing its <em>settings.pause</em> property to <em>true</em>.
 * @memberof prototype
 * @readonly
 * @param {object=} bindHolder An object (namespace) on which to pause the updating of bindings.
 * @returns {function}
 * @since 1.0.0
 * @example
 * let cNamespace = {}
 * const desc = {
 *     a: 1,
 *     b: function() {
 *         console.log('updated a value: ', this.a)
 *     }
 * }
 *
 * dbind(cNamespace, desc)
 *
 * // pause the updating of bindings on dbind
 * dbind.pause(cNamespace) // shortcut to dbind.prototype.pause
 *
 * // the binding is not updated,
 * dbind(cNamespace, {a: 3})
 * // but preparations for updating are completed
 * console.log(cNamespace.updateQueue) // Array [ b() ]
 */
prototype.pause = function () {}

/**
 * <strong>dbind.prototype.refresh</strong><br/>
 * Returns a function through its getter. Return function can be effectively called only on paused objects (see [dbind.prototype.pause]{@link prototype#pause}). When used with a paused object as argument, will trigger the execution of all pending bindings' updates. If the argument is not specified the <em>bindHolder</em> defaults to <em>dbind</em> for type, or instance for instance. On completion of call the <em>bindHolder</em> remains paused (<em>bindHolder.settings.pause</em> = <em>true</em>).
 * @memberof prototype
 * @readonly
 * @param {object=} bindHolder An paused object (namespace) on which to trigger the execution of all pending bindings' updates.
 * @returns {function}
 * @since 1.0.0
 * @example
 * const desc = {
 *     a: 1,
 *     b: function() {
 *         console.log('updated a value: ', this.a)
 *     }
 * }
 *
 * dbind(desc)
 *
 * // pause the updating of bindings
 * dbind.pause() // shortcut to dbind.prototype.pause
 *
 * dbind({a: 3})
 *
 * // run pending updates
 * dbind.refresh()
 */
prototype.refresh = function () {}

/**
 * <strong>dbind.prototype.reset</strong><br/>
 * Returns a function through its getter. The <em>bindHolder</em> provided as argument to this function gets its DBindJS relevant properties reset to default values. Among others this means that all the bindings defined on the <em>bindHolder</em> (namespace) will be deleted.<br/>
 * The difference betwen this method and [dbind.prototype.defaultRuntime]{@link prototype#defaultRuntime} is that dbind.prototype.reset can be used without an argument. If the argument is not specified the <em>bindHolder</em> defaults to <em>dbind</em> for type, or instance for instance.
 * @memberof prototype
 * @readonly
 * @param {object=} bindHolder An object (namespace) to get its DBindJS relevant properties reset to default values.
 * @returns {function}
 * @since 1.0.0
 */
prototype.reset = function () {}

/**
 * <strong>dbind.prototype.resume</strong><br/>
 * Returns a function through its getter. Upon calling this function, the updating of bindings is resumed for the object (namespace) provided as argument.<br/>
 * Return function unpauses the <em>bindHolder</em> by changing its <em>settings.pause</em> property to <em>false</em>, and calls [dbind.prototype.refresh]{@link prototype#refresh}. If argument is not specified the <em>bindHolder</em> defaults to <em>dbind</em> for type, or instance for instance.<br/>
 * @memberof prototype
 * @readonly
 * @param {object=} bindHolder An object (namespace) on which to resume the updating of bindings.
 * @returns {function}
 * @since 1.0.0
 * @example
 * const desc = {
 *     a: 1,
 *     b: function() {
 *         console.log('updated a value: ', this.a)
 *     }
 * }
 *
 * dbind(desc)
 *
 * // pause the updating of bindings
 * dbind.pause() // shortcut to dbind.prototype.pause
 *
 * dbind({a: 3})
 *
 * // run pending updates and unpause dbind
 * dbind.resume()
 *
 * console.log(dbind.settings.pause) // false
 */
prototype.resume = function () {}

/**
 * <strong>dbind.prototype.runUpdateQueue</strong><br/>
 * Getter-only property meant for internal or advanced use.<br/>
 * Returns a function through its getter. Call this function using a <em>bindHolder</em> as argument to trigger the execution of all pending bindings' updates stored on the <em>bindHolder</em>.<br/>The behaviour of the return function is not influenced by <em>bindHolder.settings.mergeUpdates</em> and <em>bindHolder.settings.pause</em> values.
 * @memberof prototype
 * @readonly
 * @param {object} bindHolder An object (namespace) on which to trigger the execution of all pending bindings' updates.
 * @returns {function}
 * @since 1.0.0
 * @example
 * const desc = {
 *     a: 1,
 *     b: function() {
 *         console.log('updated a value: ', this.a)
 *     }
 * }
 *
 * dbind(desc)
 *
 * // pause the updating of bindings
 * dbind.pause() // shortcut to dbind.prototype.pause
 *
 * dbind({a: 3})
 *
 * // run all pending updates
 * dbind.prototype.runUpdateQueue(dbind)
 *
 * console.log(dbind.updateQueue) // empty array
 */
prototype.runUpdateQueue = function (bindHolder) {}

/**
 * <strong>dbind.prototype.storeMemberKeys</strong><br/>
 * Used internally for integrity check of <em>bindHolder</em> property propstore. Value liable to change in future versions.
 * @default <strong>dependencies,previousValue,value</strong>
 * @constant
 * @type {String}
 * @memberof prototype
 * @since 1.0.0
 * @example
 * console.log('dbind.prototype.storeMemberKeys: ', dbind.prototype.storeMemberKeys) // dependencies,previousValue,value
 */
prototype.storeMemberKeys = {}

/**
 * <strong>dbind.prototype.update</strong><br/>
 * Returns a function through its getter. The return function it's just a shortcut to the [constructor function]{@link dbind}.<br/>
 * When using an instance of <em>dbind</em> it is mandatory to use update method or constructor function to actually update a binding pool.
 * @memberof prototype
 * @readonly
 * @param {object} bindingPoolDescriptor_or_bindHolder An object representing either the bind holder, or an object representing the binding pool descriptor if the default <em>bindHolder</em> is used (<em>dbind</em> for type and instance for instance).
 * @param {object=} bindingPoolDescriptor The binding pool descriptor when a <em>bindHolder</em> is specified.
 * @returns {function}
 * @since 1.0.0
 * @example
 * const desc = {
 *     a: 1,
 *     b: function() {
 *          console.log("updated 'a' value: ", this.a)
 *     }
 * }
 *
 * dbind(desc) // type dbind
 *
 * const inst = new dbind(desc) // instance of dbind
 *
 * // update the type: is sufficient to use the class constructor
 * dbind({a: 3})
 *
 *
 * // update the instance
 * inst.update({a: 3})
 * // , or
 * inst.constructor({a: 5})
 *
 * // TypeError: inst is not a function
 * inst({a: 7})
 */
prototype.update = function (bindingPoolDescriptor_or_bindHolder, bindingPoolDescriptor) {}

/**
 * <strong>dbind.prototype.updateDataBindings</strong><br/>
 * Getter-only property meant for internal or advanced use.<br/>
 * Returns a function through its getter. Upon calling the return function a search for bindings depending on <em>propertyName</em> is performed. When a positive match is found then an action is taken as follows: <ul><li>if <em>bindHolder.settings.mergeUpdates</em>: <em>true</em> then push the binding to <em>bindHolder.updateQueue</em> while keeping this array unique</li><li>if <em>bindHolder.settings.mergeUpdates</em>: <em>false</em> then just call the binding</li></ul><br/>
 * Return function is called on each successfull update of a basic property or binding function (included with the getters) whether or not the <em>bindHolder</em> is paused.<br/>
 * A call to <em>updateDataBindings</em> is also performed from <em>dbind.prototype.refresh</em>. The call is done with the intention to check for any manual user updates to value property of <em>bindHolder.propstore</em> properties. This is the only case where manual usage of <em>updateDataBindings</em> makes sense. See example below.
 * @memberof prototype
 * @readonly
 * @param {object} bindHolder An object (namespace) on which to search bindings depending on the <em>propertyName</em>.
 * @param {string} propertyName An string representing the name of the property with the value changed.
 * @returns {function}
 * @since 1.0.0
 * @example
 * const desc = {
 *     a: 1,
 *     b: function() {
 *         console.log('updated a value: ', this.a)
 *     }
 * }
 *
 * dbind(desc)
 *
 * // manually alter a.value
 * dbind.propstore.a.value = 11
 *
 * // nothing to update at the moment
 * const pastUQ = dbind.updateQueue
 * console.log(pastUQ) // empty array
 *
 * // manually update dbind.updateQueue
 * dbind.prototype.updateDataBindings(dbind, 'a')
 *
 * // ready to update
 * console.log(dbind.updateQueue) // Array [ b() ]
 *
 * // update
 * dbind.refresh()
 *
 *
 * //// when changing values in dbind.bindstore, it is not necessary to call dbind.prototype.updateDataBindings
 * dbind.bindstore.a = 22
 *
 * // ready to update
 * console.log(dbind.updateQueue) // Array [ b() ]
 *
 * // update
 * dbind.refresh()
 */
prototype.updateDataBindings = function (bindHolder, propertyName) {}
