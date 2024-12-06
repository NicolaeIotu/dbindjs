'use strict'

import { dbind } from '../lib/dbindjs.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'

let external_var = 0

const desc = {
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
    const dep = this.d()
    external_var = this.a / this.b / dep
    // console.log(inrc)

    // use result somewhere else outside of the binding pool
    // ...
  },

  // Binding, Internal
  // defines a binding relation which is used by other bindings in the binding pool
  d: function () {
    const inrd = this.a + this.b + this.f
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
    const dfn = this.d()
    const inre = this.a + this.b + dfn
    // console.log(inre)

    // use result somewhere else outside of the binding pool
    // ...

    // output for other bindings
    return inre
  },

  // Binding, Basic
  f: 2,
  // ...
  // ...

  z: function () {}
}
dbind(desc)

test('Test complex', async (t) => {
  dbind({ a: 23, f: 45 })
  await t.test('Ok', () => {
    assert.equal(dbind.propstore.e.value(), 93)
  })

  await t.test('Error', () => {
    const a_propstore = dbind.propstore.a
    dbind.propstore.a = {}
    dbind({ a: 34, f: 56 })
    assert.notEqual(dbind.propstore.e.value(), 126)
    dbind.propstore.a = a_propstore
    dbind({ a: 34, f: 56 })

    dbind({ bindstore: 1 }, { a: 12, f: 34 })
    assert.equal(dbind.propstore.e.value(), 126)

    assert.throws(() => dbind.prototype.runUpdateQueue({ updateQueue: 1 }))

    assert.throws(() => dbind.prototype.addData(
      { propstore: 1, bindstore: 2 },
      'a',
      1,
      null
    ))
    assert.throws(() => dbind.prototype.addData(
      { aa: 1, bb: 2 },
      'a',
      1,
      null
    ))
    assert.throws(() => dbind.prototype.addData(
      null,
      'a',
      1,
      null
    ))

    assert.throws(() => dbind.prototype.updateDataBindings(
      { propstore: 1, bindstore: 2 }))
    dbind.prototype.updateDataBindings(
      {
        settings: { mergeUpdates: false },
        propstore: {
          z: {
            dependencies: ['z']
          }
        }
      },
      'z'
    )
  })
})

test('Test "pause/refresh/resume/reset"', async (t) => {
  const prev_external_var = external_var
  dbind.prototype.pause()
  dbind({ a: 1, f: 2 })
  assert.equal(external_var, prev_external_var)

  assert.throws(() => dbind.prototype.pause({}))

  assert.throws(() => dbind.prototype.refresh({}))
  dbind.prototype.refresh({
    settings: {}
  })
  assert.equal(external_var, prev_external_var)
  dbind.prototype.refresh({
    settings: {},
    propstore: {
      tt: {
        dependencies: null,
        value: 1,
        previousValue: 2,
      }
    }
  })
  dbind.prototype.refresh()

  assert.throws(() => dbind.prototype.resume({}))
  dbind.prototype.resume()
  assert.notEqual(external_var, prev_external_var)

  assert.throws(() => dbind.prototype.reset({}))
  dbind.prototype.reset()
  assert.ok(Object.prototype.hasOwnProperty.call(dbind, 'updateQueue'))
  assert.ok(dbind.updateQueue.length === 0)
})
