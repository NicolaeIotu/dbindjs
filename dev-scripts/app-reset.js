'use strict'

import { rmSync, mkdirSync, existsSync, readFileSync } from 'fs'

if (!existsSync('./package.json')) {
  console.error('Cannot find package.json.')
  process.exit(1)
}

function getTgzPackageName () {
  const package_desc = readFileSync('./package.json', { encoding: 'utf-8' })
  const package_json = JSON.parse(package_desc)
  return package_json.name + '-' + package_json.version + '.tgz'
}

const tgzPackageName = getTgzPackageName()

rmSync(tgzPackageName, { force: true })
rmSync('./dist', { force: true, maxRetries: 3, recursive: true })
rmSync('./docs', { force: true, maxRetries: 3, recursive: true })
rmSync('./.nyc_output', { force: true, maxRetries: 3, recursive: true })
rmSync('./.tap', { force: true, maxRetries: 3, recursive: true })
rmSync('./node_modules', { force: true, maxRetries: 3, recursive: true })

mkdirSync('./dist', { recursive: true })
mkdirSync('./docs', { recursive: true })
