/**
 *                           U-ANT 🐜
 *               Unofficial Aussie Network Tester
 * A light weight Node script to test latency and download speeds.
 */

// Main packages
const program = require('commander')
const chalk = require('chalk')
const figlet = require('figlet')

// U-ANT packages
const speed = require('./speedTest.js')
const latency = require('./latencyTest.js')

// Command options
program
  .version('2.0.0')
  .option('-s, --speed', 'Run SpeedTest')
  .option('-l, --latency', 'Run latency Tests')
  .option('-a, --auto-run [cron]', 'Auto run every x hours, Terminal/CMD window must stay open', '0 */4 * * *')
  .parse(process.argv)

// ascii title for U-ANT
console.log(chalk.magentaBright(figlet.textSync('U-ANT', {
  horizontalLayout: 'fitted'
})))

// Subtitle for U-ANT
console.log(chalk.yellowBright(' A light weight script to test latency and download speeds. \n'))

if (program.speed) speed.runTest()
if (program.latency) latency.runTest()
