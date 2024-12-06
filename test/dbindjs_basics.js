'use strict'

import { dbind } from '../lib/dbindjs.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const desc = {
  v: 2,
  t: 1,
  k: function () {
    return this.t + this.v
  }
}

dbind(desc)

const dp = dbind.prototype
// define a binding function in the same binding pool and make it dependable on a lesser number of basic properties
dp.addData(dbind, 'x', 2)
dp.addData(dbind,
  'custom_binding',
  function () {
    let a = this.x * 2
    // ...
  },
  ['x'])

// trigger only the initial binding k
dbind({ t: 11 })

// trigger only 'custom_binding'
dbind({ x: 4 })

test('Test basics', async (t) => {
  await t.test('Ok',() => {
    assert.equal(dbind.propstore.k.value(), 13)
  })
})
