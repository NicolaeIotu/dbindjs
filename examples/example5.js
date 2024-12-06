'use strict'

import { dbind } from '../lib/dbindjs.js'

// This example simulates a fully connected neural network of 'maxNeurons' neurons
// (100000). The number of neurons can be increased or decreased to match testing
// machine capabilities. When using the default value (100000 neurons), the example
// should run instantly on a standard personal computer.
//
// Changes to any components of this network trigger propagation to all 'neurons'.
//
// All sorts of actions can be triggered. This example prints a result if 'neuron'
// data meets a certain condition.

const maxNeurons = 100000
const miniBrain = {}
for (let i = 0; i < maxNeurons; i++) {
  miniBrain['n' + i] = {
    synapseFiringTrigger: 0,
    neuronData: {
      a: Math.random() * 100,
      b: Math.random() * 100000
    },
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
      // eslint-disable-next-line no-prototype-builtins
      if (miniBrain.hasOwnProperty(prop) && miniBrain[prop].hasOwnProperty('act')) {
        miniBrain[prop].act()
      }
    }
  }
}

for (const prop in miniBrain) {
  desc[prop] = miniBrain[prop].synapseFiringTrigger
}

dbind(desc)

// pick a random neuron
const neuronId = 'n' + Math.round(Math.random() * maxNeurons)
const probe = {}
probe[neuronId] = dbind.propstore[neuronId].value++

dbind(probe)
