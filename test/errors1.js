'use strict'

import t from 'tap'
import { dbind } from '../lib/dbindjs.js'

t.throws(dbind)
t.throws(() => dbind(1))
t.throws(() => dbind(1, 2))
t.throws(() => dbind({}, 2))

const frozen = {}
Object.freeze(frozen)
t.throws(() => dbind(frozen, 2))

t.throws(() => dbind({}))
