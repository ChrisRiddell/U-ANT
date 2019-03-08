/**
 *  U-ANT 🐜
 * "u ant got no problems", A light weight tool to test latency and download speeds.
 */

const figlet = require('figlet')
const chalk = require('chalk')
var program = require('commander')
const axios = require('axios')
const schedule = require('node-schedule')
const ping = require('ping')

// Speedtest server ID list
const servers = ['2628']

// Ping addresses
const addressList = {
  Adelaide: {
    url: 'lg-ade.aussiebroadband.com.au',
  },
  Brisbane: {
    url: 'lg-bne.aussiebroadband.com.au',
  },
  Perth: {
    url: 'lg-per.aussiebroadband.com.au',
  },
  Melbourne: {
    url: 'lg-mel.aussiebroadband.com.au',
  },
  Sydney: {
    url: 'lg-syd.aussiebroadband.com.au',
  }
};

console.log(figlet.textSync('U-ANT', {
  horizontalLayout: 'fitted'
}))

console.log(chalk.yellowBright(' "Unofficial Aussie Net Tester", A tool to record latency and internet speeds. \n'))

// Command Options
program
  .version('1.0.0')
  .option('-A, --auth', 'Authenticate account')
  .option('-R, --register', 'Register account')
  .option('-Z, --view', 'view results')
  .option('-C, --code [type]', 'viewer Code results')
  .option('-E, --email [type]', 'Email for Authentication or register')
  .option('-P, --password [type]', 'Password for Authentication or register')
  .parse(process.argv)

// Auth Token for use in the auth header
let authToken

if (program.auth) {

  axios({
    method: 'post',
    url: 'http://localhost:8268/accounts/auth',
    headers: { 'Content-Type': 'application/json' },
    data: {
      email: program.email,
      password: program.password
    }
  }).then(response => {
    authToken = `bearer ${response.data.token}`

    displayBlock('green', ['Running', `    Yes`, 'Run Every', `    3 Hours`])
    runner()

    var scheduleRunner = schedule.scheduleJob('0 */3 * * *', function(){
      runner()
    })


  }).catch(err => {
    displayBlock('red', ['Error', `    Failed to Authenticate account`])
  })

} else if (program.register) {
  axios({
    method: 'post',
    url: 'http://localhost:8268/accounts',
    headers: { 'Content-Type': 'application/json' },
    data: {
      email: program.email,
      password: program.password
    }
  }).then(response => {
    displayBlock('green', ['Email', `    ${response.data.email}`, 'Password', `    ${response.data.password}`, 'View Code', `    ${response.data.view_code}`])
  }).catch(err => {
    displayBlock('red', ['Error', `    Failed to register account`])
  })
} else if (program.view) {
  //console.log(program.code)
  axios({
    method: 'get',
    url: 'http://localhost:8268/speed/' + program.code + '?month=3',
    headers: { 'Content-Type': 'application/json' },
  }).then(response => {
    //console.log('here')
    //console.log(response)
    let adelaide = []
    for (dataz in response.data) {
      //console.log(response.data[dataz])
      for (dataz2 in response.data[dataz].results) {
        //console.log(response.data[dataz].results[dataz2])
        adelaide.push(response.data[dataz].results[dataz2].download)
      }
    }
    //console.log(adelaide)
    var asciichart = require ('asciichart')
    console.log("Adelaide Download")
    console.log (asciichart.plot (adelaide,{ height: 15 }))
  }).catch(err => {
    console.log(err)
  })

}

const displayBlock = (colour, messages) => {
  console.log(chalk[colour]('----------------------------------------------------------------------------'))
  for (var m of messages) {
    console.log(chalk[colour](m))
  }
  console.log(chalk[colour]('----------------------------------------------------------------------------'))
}

const runner = async () => {
  let ping = await getPing()
  let speedResults = await speed_run()

  axios({
    method: 'post',
    url: 'http://localhost:8268/latency',
    headers: { 'Content-Type': 'application/json', 'Authorization': authToken},
    data: ping
  }).then(response => {
    console.log(response.data.message)
  }).catch(err => {
    displayBlock('red', ['Error', `    Failed to submit Latency to API Server`])
  })

  axios({
    method: 'post',
    url: 'http://localhost:8268/speed',
    headers: { 'Content-Type': 'application/json', 'Authorization': authToken},
    data: speedResults
  }).then(response => {
    console.log(response.data.message)
  }).catch(err => {
    displayBlock('red', ['Error', `    Failed to submit Speed to API Server`])
  })
}

const speed_run = async () => {
  let finalData = []
  for (server in servers) {
    let speedData = await speedService(servers[server])
    let newData = {
      location: speedData.server.location,
      isp: speedData.client.isp,
      cc: speedData.server.cc,
      host: speedData.server.host,
      download: speedData.speeds.download,
      upload: speedData.speeds.upload
    }
    finalData.push(newData)
  }
  return finalData
}

const speedService = (id) => {
  return new Promise(function (resolve, reject) {
    require('speedtest-net')({maxTime: 30000, serverId: id}).on('data', data => {
      resolve(data)
    });
  })
}


const getPing = async () => {

  let allData = []  

  for (let name in addressList) {
    let server = addressList[name];

    const response = await ping.promise.probe(server.url, {
      timeout: 5,
      min_reply: 25
    });

    /* if(response.min == 'unknown') {
      response.min = 'failed';
    } */
  
    let newList = {
      address: server.url,
      minimum: response.min,
      maximum: response.max,
      average: response.avg
    }

    allData.push(newList);
  }
  
  // Return a Promise so i can get to the data once all asyncs are done
  return new Promise(function(resolve, reject) {
    resolve(allData)
  })
}