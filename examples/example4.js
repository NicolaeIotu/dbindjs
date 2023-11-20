'use strict'

import { dbind } from '../lib/dbindjs.js'

const holder = {
  n0: {
    data1: 1,
    data2: 2,
    data3: 3,
    trigger: 0,
    act: function () {
      console.log('n0')
    }
  },
  n1: {
    data1: 2,
    data2: 4,
    data3: 6,
    trigger: 0,
    act: function () {
      console.log('n1')
    }
  },
  n2: {
    data1: 3,
    data2: 6,
    data3: 9,
    trigger: 0,
    act: function () {
      console.log('n2')
    }
  },
  n3: {
    data1: 4,
    data2: 8,
    data3: 12,
    trigger: 0,
    act: function () {
      console.log('n3')
    }
  }
}

dbind({
  n0: holder.n0.trigger,
  n1: holder.n1.trigger,
  n2: holder.n2.trigger,
  n3: holder.n3.trigger,
  action1: function () {
    for (const prop in this) {
      // eslint-disable-next-line no-prototype-builtins
      if (holder.hasOwnProperty(prop) && holder[prop].hasOwnProperty('act')) {
        holder[prop].act()
      }
    }
  }
})

dbind({ n0: 2, n1: 4 })
