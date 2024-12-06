/* node:coverage disable */
import { spec } from 'node:test/reporters'
import { run } from 'node:test'
import process from 'node:process'
import { readdirSync } from 'node:fs'

const target_coveredLinePercent = 100
const target_coveredBranchPercent = 100
const target_coveredFunctionPercent = 100

const is_coverage_only = process.argv.length > 2 && process.argv.filter(elem => elem === 'coverage').length > 0

/**
 * @param {TestsStream} testsStream
 * @param {boolean} is_coverage_only
 */
function init (testsStream, is_coverage_only) {
  if (!is_coverage_only) {
    testsStream
      .compose(spec)
      .pipe(process.stdout)
  }
}

init(run({
    files: readdirSync('test')
      .filter((file_name) => file_name !== 'main.js')
      .map(file_name => 'test/' + file_name)
  })
    .on('test:coverage', (data) => {
      const coverage_errors = []

      let coveredLinePercent = 100
      let coveredBranchPercent = 100
      let coveredFunctionPercent = 100

      try {
        coveredLinePercent = data.summary.totals.coveredLinePercent
        if (Number.isFinite(coveredLinePercent) &&
          coveredLinePercent < target_coveredLinePercent) {
          coverage_errors.push('Insufficient lines coverage: ' + data.summary.totals.coveredLinePercent +
            ' / ' + target_coveredLinePercent)
        }
      } catch {
      }
      try {
        coveredBranchPercent = data.summary.totals.coveredBranchPercent
        if (Number.isFinite(coveredBranchPercent) &&
          coveredBranchPercent < target_coveredBranchPercent) {
          coverage_errors.push('Insufficient branch coverage: ' + data.summary.totals.coveredBranchPercent +
            ' / ' + target_coveredBranchPercent)
        }
      } catch {
      }
      try {
        coveredFunctionPercent = data.summary.totals.coveredFunctionPercent
        if (Number.isFinite(coveredFunctionPercent) &&
          coveredFunctionPercent < target_coveredFunctionPercent) {
          coverage_errors.push('Insufficient function coverage: ' + data.summary.totals.coveredFunctionPercent +
            ' / ' + target_coveredFunctionPercent)
        }
      } catch {
      }

      if (is_coverage_only) {
        // observe
        console.log(coveredLinePercent)
      } else {
        coverage_errors.length === 0 || setTimeout(() => {
          coverage_errors.forEach((err) => {
            console.error(err)
          })
          process.exit(1)
        }, 500)
      }
    }),
  is_coverage_only)
