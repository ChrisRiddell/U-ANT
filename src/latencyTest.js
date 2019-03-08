/**
 *                           U-ANT 🐜
 *               Unofficial Aussie Network Tester
 * A light weight Node script to test latency and download speeds.
 */

// Main packages
const chalk = require('chalk')
const ora = require('ora')
const ping = require('ping')

const hosts = [
  '192.168.1.1',
  'google.com',
  'yahoo.com'
]

exports.runTest = function() {
  let results = []
  hosts.forEach(function (host) {
      ping.promise.probe(host, {
      timeout: 10,
      min_reply: 25
    })
      .then(function (res) {
        results.push(res)
      })
  })

  return new Promise(function(resolve, reject) {
    resolve(results)
  })
}
