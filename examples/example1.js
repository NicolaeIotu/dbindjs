'use strict'

import { dbind } from '../lib/dbindjs.js'

dbind({
  // Property, Basic
  // when the value of this property changes, the bindings depending on it automatically update
  a: 1,

  // Property, Basic
  b: 1,

  // Binding, Basic
  // defines a binding relation (which may include internal bindings) within the pool,
  // and uses results outside the pool
  c: function () {
    // use references to basic properties of the binding pool
    const dep = this.d()
    const inrc = this.a / this.b / dep
    console.log(inrc)

    // use result somewhere else outside the binding pool
    // ...
  },

  // Binding, Internal
  // defines a binding relation which is used by other bindings in the binding pool
  d: function () {
    const inrd = this.a + this.b + this.f
    console.log(inrd)

    // output for other bindings
    return inrd
  },

  // Binding, Complex
  // defines a binding relation (which may include internal bindings) within the pool,
  // uses results outside the pool
  // and can be used by other bindings in the binding pool
  e: function () {
    // use references to basic properties of the binding pool
    const dep = this.d()
    const inre = this.a + this.b + this.f + dep
    console.log(inre)

    // use result somewhere else outside the binding pool
    // ...

    // output for other bindings
    return inre
  },

  // Binding, Basic
  f: 2
  // ...
  // ...
})

// trigger the bindings by changing the values of some dependencies
dbind({ a: 23, f: 45 })
