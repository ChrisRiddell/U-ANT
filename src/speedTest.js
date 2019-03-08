/**
 *                           U-ANT 🐜
 *               Unofficial Aussie Network Tester
 * A light weight Node script to test latency and download speeds.
 */

// Main packages
const chalk = require('chalk')
const ora = require('ora')
const speedTest = require('speedtest-net')

exports.runTest = function() {
    var test = speedTest({maxTime: 5000});
    const spinner = ora('Loading unicorns').start();
    
    test.on('data', data => {
      spinner.succeed();
      console.dir(data);
      
    });

    return new Promise(function(resolve, reject) {
        resolve()
    })
}
