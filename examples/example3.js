'use strict'

import { dbind as Dbind } from '../lib/dbindjs.js'

// the binding bool descriptor
const desc = {
  a: 1,
  b: 2,
  c: 3,
  d: function () {
    const val = this.x + this.y / this.z
    console.log('d updated val: ', val)
    // ...
  },
  x: 4,
  y: 5,
  z: 6
}

// dbindInstance (instance of dbind)
const dbindInstance = new Dbind(desc)

// add a basic property to the binding pool
dbindInstance.addData(dbindInstance, 'r', 55)

// add a new binding function 'custom_binding'
dbindInstance.addData(dbindInstance,
  // the name of the property
  'custom_binding',

  // the binding function
  function () {
    const val = this.a + this.r
    console.log('custom_binding updated val: ', val)
    // ...
  },

  // the dependencies of the binding function
  ['a', 'r']
)

// trigger 'custom_binding'
dbindInstance.update({ a: 22 })
// trigger 'custom_binding'
dbindInstance.update({ r: 99 })
// trigger 'custom_binding'
dbindInstance.update({ a: 3, r: 7 })
// trigger 'custom_binding'
dbindInstance.constructor({ a: 7, r: 3 })
