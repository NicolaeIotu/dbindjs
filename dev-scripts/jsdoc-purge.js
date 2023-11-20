'use strict'

import { existsSync, rmSync, mkdirSync } from 'fs'

if (!existsSync('./package.json')) {
  console.error('Cannot find package.json.')
  process.exit(1)
}

rmSync('./docs', { force: true, maxRetries: 3, recursive: true })
mkdirSync('./docs', { recursive: true })
