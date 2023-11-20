/**
 * dbind can be used in the same way as type (recommended) or as instance. **dbindjs** can separate binding pools in
 * namespaces (`bindHolder` parameter).<br>
 * Depending on the format of the `bindingPoolDescriptor` parameter, this class constructor method can either define,
 * or update binding pools on different namespaces. When the `bindingPoolDescriptor` object has at least a property
 * with a function as value, then `bind` defines a binding pool on the `bindHolder` if specified, or if not specified
 * on the prototype if using the type `dbind`, or on itself if using the instance.<br/>
 * The usage of dual meaning first parameter is intentional. In this way when using **dbindjs** if the `bindHolder`
 * is different then the default values, it must be specified as first argument for most methods or returns of getter
 * properties of `dbind`. When using default values for `bindHolder`, then for most of the metods the `bindHolder`
 * can be omitted (only important methods normally used internally require all the time the `bindHolder`
 * as first argument). The default values for `bindHolder` are `dbind.prototype` when using the type `dbind`,
 * and instance itself when using an instance of `dbind`.
 * @class The main class of DBindJS.
 * @param {object} bindingPoolDescriptor_or_bindHolder An object representing either the bind holder, or an object
 * representing the binding pool descriptor if the default <em>bindHolder</em> is used (<em>dbind</em> for type
 * and instance for instance).
 * @param {object=} <em>bindingPoolDescriptor</em> The binding pool descriptor when a <em>bindHolder</em> is specified.
 * @property {object} prototype <strong>dbind.prototype</strong> contains all core properties and methods of
 * <em>dbind</em>. When using <em>dbind</em> as type, the methods listed here are just shortcuts to
 * <em>dbind.prototype</em> properties. When using <em>dbind</em> as instance, the same methods are inherited
 * through the prototype chain. See documentation on [dbind.prototype]{@link prototype}.
 * @property {function} update() Updates the bindings. The method itself it's a shortcut to the class constructor.
 * See {@link dbind.update}.
 * @property {function} reset() Defaults a <em>bindHolder</em> holding the bindings. See {@link dbind.reset}.
 * @property {function} pause() Pauses the updating of bindings for a <em>bindHolder</em>. See {@link dbind.pause}.
 * @property {function} refresh() Updates the bindings for a paused <em>bindHolder</em>. See {@link dbind.refresh}.
 * @property {function} resume() Resumes the updating of bindings for a paused <em>bindHolder</em>.
 * See {@link dbind.resume}.
 * @since 1.0.0
 * @example
 * const { dbind } = require('dbindjs')
 *
 * dbind({
 *   // Property, Basic
 *   // when the value of this property changes, the bindings depending on it automatically update
 *   a: 1,
 *
 *   // Property, Basic
 *   b: 1,
 *
 *   // Binding, Basic
 *   // defines a binding relation (which may include internal bindings) within the pool,
 *   // and uses results outside of the pool
 *   c: function () {
 *     // use references to basic properties of the binding pool
 *     const dep = this.d()
 *     const inrc = this.a / this.b / dep
 *     console.log(inrc)
 *
 *     // use result somewhere else outside of the binding pool
 *     // ...
 *   },
 *
 *   // Binding, Internal
 *   // defines a binding relation which is used by other bindings in the binding pool
 *   d: function () {
 *     const inrd = this.a + this.b + this.f
 *     console.log(inrd)
 *
 *     // output for other bindings
 *     return inrd
 *   },
 *
 *   // Binding, Complex
 *   // defines a binding relation (which may include internal bindings) within the pool,
 *   // uses results outside of the pool
 *   // and can be used by other bindings in the binding pool
 *   e: function () {
 *     // use references to basic properties of the binding pool
 *     const dep = this.d()
 *     const inre = this.a + this.b + this.f + dep
 *     console.log(inre)
 *
 *     // use result somewhere else outside of the binding pool
 *     // ...
 *
 *     // output for other bindings
 *     return inre
 *   },
 *
 *   // Binding, Basic
 *   f: 2
 *   // ...
 *   // ...
 * })
 *
 *  // trigger the bindings by changing the values of some dependencies
 *  dbind({ a: 23, f: 45 })
 */
var dbind = function (bindingPoolDescriptor_or_bindHolder, bindingPoolDescriptor) {}

/**
 * <strong>dbind.prototype</strong> contains all core properties and methods of {@link dbind}.
 * When using <em>dbind</em> as type, the methods listed here are just shortcuts to <em>dbind.prototype</em>
 * properties. When using <em>dbind</em> as instance the same methods are inherited through the prototype chain.
 * See documentation on [dbind.prototype]{@link prototype}.
 * @name prototype
 * @alias dbind.prototype
 * @memberof dbind#
 * @since 1.0.0
 */
dbind.prototype = {}

/**
 * dbind.update is a shortcut to [dbind.prototype.update]{@link prototype#update}.<br/>
 * When using an instance of <em>dbind</em> it is mandatory to use update method or constructor function to actually
 * update a binding pool.
 * @param {object} bindingPoolDescriptor_or_bindHolder An object representing either the bind holder, or an object
 * representing the binding pool descriptor if the default <em>bindHolder</em> is used (<em>dbind</em> for type and
 * instance for instance).
 * @param {object=} bindingPoolDescriptor The binding pool descriptor when a <em>bindHolder</em> is specified.
 * @see [dbind.prototype.update]{@link prototype#update}.
 */
dbind.update = function (bindingPoolDescriptor_or_bindHolder, bindingPoolDescriptor) {}

/**
 * dbind.pause is a shortcut to [dbind.prototype.pause]{@link prototype#pause}.
 * @param {object=} bindHolder An object (namespace) on which to pause the updating of bindings.
 * @see [dbind.prototype.pause]{@link prototype#pause}.
 */
dbind.pause = function (bindHolder) {}

/**
 * dbind.refresh is a shortcut to [dbind.prototype.refresh]{@link prototype#refresh}.
 * @param {object=} bindHolder An paused object (namespace) on which to trigger the execution of all pending
 * bindings' updates.
 * @see [dbind.prototype.refresh]{@link prototype#refresh}.
 */
dbind.refresh = function () {}

/**
 * dbind.resume is a shortcut to [dbind.prototype.resume]{@link prototype#resume}.
 * @param {object=} bindHolder An object (namespace) on which to resume the updating of bindings.
 * @see [dbind.prototype.resume]{@link prototype#resume}.
 */
dbind.resume = function (bindHolder) {}

/**
 * dbind.reset is a shortcut to [dbind.prototype.reset]{@link prototype#reset}.
 * @param {object=} bindHolder An object (namespace) to get its DBindJS relevant properties reset to default values.
 * @see [dbind.prototype.reset]{@link prototype#reset}.
 */
dbind.reset = function (bindHolder) {}
