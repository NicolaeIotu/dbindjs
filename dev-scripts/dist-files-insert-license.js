'use strict'

import { readdirSync, readFileSync, createWriteStream } from 'fs'

/* dbindjs - data binding for Javascript
dbindjs is Copyright (C) 2017-2023 Nicolae Iotu, nicolae.g.iotu@gmail.com

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

console.log('Inserting license section to ./dist files ...')

const licenseText = '/* dbindjs - data binding for Javascript\n' +
  'dbindjs is Copyright (C) 2017-2023 Nicolae Iotu, nicolae.g.iotu@gmail.com\n' +
  'This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General' +
  ' Public License as published by the Free Software Foundation, either version 3 of the License, or (at your' +
  ' option) any later version.\n' +
  'This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the' +
  ' implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.\n' +
  'See the GNU Affero General Public License for more details.\n' +
  'You should have received a copy of the GNU Affero General Public License along with this program. If not, see' +
  ' <https://www.gnu.org/licenses/>. */\n'

readdirSync('./dist').filter((elem) => {
  return elem.match(/.js$/)
}).forEach((jsfile) => {
  const fc = readFileSync(`./dist/${jsfile}`)
  const ws = createWriteStream(`./dist/${jsfile}`, { start: 0, flag: 'as' })
  ws.write(licenseText)
  ws.write(fc)
  ws.close()
})

console.log('Done inserting license section to ./dist files.')
