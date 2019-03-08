/**
 *                           U-ANT 🐜
 *               Unofficial Aussie Network Tester
 * A light weight Node script to test latency and download speeds.
 */

// Main packages
const chalk = require('chalk')
const ora = require('ora')
const ping = require('ping')

const addressList = ['1.1.1.1', '8.8.8.8']

exports.runTest = async () => {

  for (let name in addressList) {
    let server = addressList[name]

    const spinner = ora(`Testing Latency to ${server}`).start()

    let response = await ping.promise.probe(server, {
      timeout: 3,
      min_reply: 25
    })

    if(response.min == 'unknown') {
      spinner.fail(chalk.redBright(`Latency to ${response.host}`))
      console.log(chalk.redBright(`    Failed!`))
    } else {
      spinner.succeed(chalk.greenBright(`Latency to ${response.host}`))
      console.log(chalk.blueBright(`    Minimum = ${Math.round(response.min)}ms, Maximum = ${Math.round(response.max)}ms, Average = ${Math.round(response.avg)}ms`))
    }

  }

  return new Promise(function (resolve, reject) {
    resolve('Done')
  })
}
