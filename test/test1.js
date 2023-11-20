'use strict'

import t from 'tap'
import { dbind } from '../lib/dbindjs.js'

dbind({
  // Property, Basic
  // when the value of this property changes, the bindings depending on it automatically update
  a: 1,

  // Property, Basic
  b: 1,

  // Binding, Basic
  // defines a binding relation (which may include internal bindings) within the pool,
  // and uses results outside of the pool
  c: function () {
    // use references to basic properties of the binding pool
    var dep = this.d()
    var inrc = this.a / this.b / dep
    // console.log(inrc)

    // use result somewhere else outside of the binding pool
    // ...
  },

  // Binding, Internal
  // defines a binding relation which is used by other bindings in the binding pool
  d: function () {
    var inrd = this.a + this.b + this.f
    // console.log(inrd)

    // output for other bindings
    return inrd
  },

  // Binding, Complex
  // defines a binding relation (which may include internal bindings) within the pool,
  // uses results outside of the pool
  // and can be used by other bindings in the binding pool
  e: function () {
    // use references to basic properties of the binding pool
    var dfn = this.d()
    var inre = this.a + this.b + dfn
    // console.log(inre)

    // use result somewhere else outside of the binding pool
    // ...

    // output for other bindings
    return inre
  },

  // Binding, Basic
  f: 2
  // ...
  // ...
})

// trigger the bindings by changing the value of the dependencies
dbind({ a: 23, f: 45 })

t.equal(dbind.propstore.e.value(), 93)
