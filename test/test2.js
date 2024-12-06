'use strict'

import { dbind } from '../lib/dbindjs.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'

// the binding bool descriptor
const desc = {
  a: 1,
  b: 2,
  c: 3,
  d: function () {
    return this.x + this.y / this.z
  },
  x: 4,
  y: 5,
  z: 6
}

// dbindInstance (instance of dbind) creates an isolated namespace
// in this namespace ALL the properties react when the value of one of them changes
const dbindInstance = new dbind(desc)

// watch the function d being triggered by changing the value of one of its dependencies
dbindInstance.update({ y: 11 })
// however, function d is also triggered by changing properties which are not among its dependencies
// this shows that once declared, the whole binding pool is connected
dbindInstance.update({ a: 7 })

// In order to change this behavior let's make function d depend on x, y and z only
dbindInstance.propstore.d.dependencies = ['x', 'y', 'z']
// changing properties which are not among its dependencies, has no effect on function d anymore
dbindInstance.update({ a: 22 })
// changing dependencies has the desired effect
dbindInstance.update({ x: 100, z: 44 })

test('Test instance', async (t) => {
  await t.test('Ok',() => {
    assert.equal(dbindInstance.propstore.d.value(), 100.25)
  })
})
