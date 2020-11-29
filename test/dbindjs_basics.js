const tap = require('tap')
const { dbind } = require(`${process.cwd()}/lib/dbindjs`)

let desc = {
  v: 2,
  t: 1,
  k: function () {
    var a = this.t + this.v
    return a
  }
}

dbind(desc)

var dp = dbind.prototype
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

tap.equal(dbind.propstore.k.value(), 13)
