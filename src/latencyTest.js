/**
 *                           U-ANT 🐜
 *               Unofficial Aussie Network Tester
 * A light weight Node script to test latency and download speeds.
 */

// Main packages
const chalk = require('chalk')
const ora = require('ora');
const ping = require('ping')

exports.runTest = function() {
  var hosts = ['192.168.1.1', 'google.com', 'yahoo.com'];

  hosts.forEach(function (host) {
      ping.promise.probe(host, {
      timeout: 10,
      min_reply: 25
    })
      .then(function (res) {
          console.log(chalk.greenBright(` ${res.host}`))
          console.log(chalk.blueBright(`    Minimum = ${Math.round(res.min)}ms\n    Maximum = ${Math.round(res.max)}ms\n    Average = ${Math.round(res.avg)}ms`))
      })
  })
}
