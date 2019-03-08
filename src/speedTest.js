/**
 *                           U-ANT 🐜
 *               Unofficial Aussie Network Tester
 * A light weight Node script to test latency and download speeds.
 */

// Main packages
const chalk = require('chalk')
const ora = require('ora')
const speedTest = require('speedtest-net')

// Speedtest server ID list
const servers = ['2628', '5031', '20637', '2789']

exports.runTest = async () => {

    for (server in servers) {
      const spinnerSpeed = ora(`Testing Speed to ${servers[server]}`).start()

      let speedData = await speedService(String(servers[server]))

      spinnerSpeed.succeed(chalk.greenBright(`Speed to ${speedData.server.sponsor} ${speedData.server.location}`))
      console.log(chalk.blueBright(`    Download = ${Math.round(speedData.speeds.download)}Mbps, Upload = ${Math.round(speedData.speeds.upload)}Mbps`))
    }

  return new Promise(function (resolve, reject) {
    resolve('Done')
  })
}

const speedService = (id) => {
  return new Promise(function (resolve, reject) {
    require('speedtest-net')({maxTime: 25000, serverId: id}).on('data', data => {
      resolve(data)
    })
  })
}