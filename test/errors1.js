'use strict'

import { dbind } from '../lib/dbindjs.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'

test('Test errors', async (t) => {
  await t.test('Throws',() => {
    assert.throws(dbind)
    assert.throws(() => dbind(1))
    assert.throws(() => dbind(1, 2))
    assert.throws(() => dbind({}, 2))
    assert.throws(() => dbind({}))

    const frozen = {}
    Object.freeze(frozen)
    assert.throws(() => dbind(frozen, 2))
  })
})



