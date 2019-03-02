/**
 *  U-ANT 🐜
 * "u ant got no problems", A light weight tool to test latency and download speeds.
 */
//
const figlet = require('figlet')
const chalk = require('chalk')
const ora = require('ora')
const speedTest = require('speedtest-net')
const ping = require('ping')

console.log(figlet.textSync('U-ANT', {
  horizontalLayout: 'fitted'
}))

function spinnerMessage (message) {
  return new ora({
    text: message,
    color: 'green'
  }).start()
}
console.log(chalk.yellowBright(' Standalone Edition v1.0.3'))
console.log(chalk.yellowBright(' "U Ant got no problem", A light weight tool to test latency and internet speeds! \n'))

function speedtest () {
  return new Promise(function (resolve, reject) {
    const test = speedTest({ maxTime: 25000 })
    test.on('data', data => {
      resolve(data)
    })
  })
}

async function pingAddresses (urls) {
  let allData = []

  // fetch all the URLs in parallel
  const pingPromises = urls.map(async url => {
    // TODO: I need to add a catch to handle a failed ping
    const response = await ping.promise.probe(url, {
      timeout: 10,
      min_reply: 25
    })
    return response
  })

  // log them in sequence
  for (const pingPromise of pingPromises) {
    let list = await pingPromise
    allData.push(list)
  }

  // Return a Promise so i can get to the data once all asyncs are done
  return new Promise(function (resolve, reject) {
    resolve(allData)
  })
}

const spinner = spinnerMessage(' Checking latency, Please be patient!')
let Downloadspinner

pingAddresses(['facebook.com', 'google.com', '1.1.1.1', '8.8.8.8']).then(function (result) {
  spinner.stop()

  for (let index = 0; index < result.length; index++) {
    console.log(chalk.blue(` ${result[index].host}`))
    console.log(chalk.green(`   Minimum = ${result[index].min}ms, Maximum = ${result[index].max}ms, Average = ${result[index].avg}ms \n`))
  }

  Downloadspinner = spinnerMessage(' Testing Speed, Please be patient!')
  return speedTest({ maxTime: 5000 })
}).then(function (result) {
  result.on('data', data => {
    Downloadspinner.stop()

    console.log(chalk.blue(' Speedtest'))
    console.log(chalk.green(`   Host = ${data.server.sponsor} ${data.server.location} `))
    console.log(chalk.green(`   Download = ${data.speeds.download}Mbps, Upload = ${data.speeds.upload}Mbps \n`))
  })
})
