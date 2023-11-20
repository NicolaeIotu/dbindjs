# dbindjs

**dbindjs** is data binding for Javascript.

Import with `import { dbind } from 'dbindjs'`


* [Run in Browser](#run-in-browser)
* [Examples](#examples)
    * [Basic dbindjs](#basic-dbindjs)
    * [Neural networks with dbindjs](#neural-networks-with-dbindjs)
* [Others](#others)

## Run in Browser
Probably the easiest way to make **dbindjs** run in browser is to upload the file *dist/dbindjs.js* to the scripts' location of your webserver and use a standard import as follows:
```html
<html>
  <head>
    ...
  </head>
  <body>
      <script type="module">
        import { dbind } from './scripts/dbindjs.js'
        // ...
      </script>
  </body>
</html>
```

## Examples
A couple of examples are provided here below. For more see 
<a href="https://github.com/NicolaeIotu/dbindjs/tree/main/examples" title="examples folder on GitHub">examples folder on GitHub</a> and 
<a href="https://github.com/NicolaeIotu/dbindjs/tree/main/docs" title="docs folder on GitHub">docs folder on GitHub</a>.

### Basic dbindjs

```
import { dbind } from 'dbindjs'

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
    const dep = this.d()
    const inrc = this.a / this.b / dep
    console.log(inrc)

    // use result somewhere else outside of the binding pool
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
  // uses results outside of the pool
  // and can be used by other bindings in the binding pool
  e: function () {
    // use references to basic properties of the binding pool
    const dep = this.d()
    const inre = this.a + this.b + this.f + dep
    console.log(inre)

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

// trigger the bindings by changing the values of some dependencies
dbind({ a: 23, f: 45 })
```

### Neural networks with dbindjs
This example simulates a **fully** connected neural network of `maxNeurons` 'neurons' 
(100000). The number of 'neurons' can be increased or decreased to match testing 
machine capabilities. When using the default value (100000 'neurons'), the example 
should run pretty fast on a standard personal computer.

Changes to any components of this network trigger propagation to all 'neurons'.

All sorts of actions can be triggered. This example prints a result if 'neuron' 
data meets a certain condition.
```
import { dbind } from 'dbindjs'

const maxNeurons = 100000
const miniBrain = {}
for (let i = 0; i < maxNeurons; i++) {
  miniBrain['n' + i] = {
    synapseFiringTrigger: 0,
    neuronData: {
      a: Math.random() * 100,
      b: Math.random() * 100000
    },
    // important! remember fat arrow functions loose 'this',
    // so don't use them with dbindjs binding functions
    act: function () {
      if (this.neuronData.a > this.neuronData.b) {
        console.log('n' + i + ': ', this.neuronData)
      }
      // alter data in order to create randomness for the next calls
      // this.neuronData.a = Math.random() * 100
      // this.neuronData.b = Math.random() * 100000
    }
  }
}

const desc = {
  action1: function () {
    for (const prop in this) {
      if (miniBrain.hasOwnProperty(prop) && miniBrain[prop].hasOwnProperty('act')) {
        miniBrain[prop].act()
      }
    }
  }
}

for (var prop in miniBrain) {
  desc[prop] = miniBrain[prop].synapseFiringTrigger
}

dbind(desc)

// pick a random neuron
const neuronId = 'n' + Math.round(Math.random() * maxNeurons)
const shakeTheNetwork = {}
shakeTheNetwork[neuronId] = dbind.propstore[neuronId].value++

dbind(shakeTheNetwork)
```

## Others

**dbindjs** incorporates a couple of advantages over existing Javascript data binding libraries:
* data binding only
* merged updates
* separation through namespaces
* advanced fine-tuning
* consistent protection
* pause/resume features
* introduces the concept of 'binding pool'

Further developments arriving soon.

**dbindjs** is © Copyright 2017-2023 Nicolae Iotu, nicolae.g.iotu@gmail.com
