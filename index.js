/**
 *  U-ANT 🐜
 * "u ant got no problems", A light weight tool to test latency and download speeds.
 */

 // TODO comment and clean up the code 

// 
const figlet = require('figlet');
const chalk = require('chalk');
const ora = require('ora');
const readlineSync = require('readline-sync');
const speedTest = require('speedtest-net');
const ping = require('ping');

console.log(figlet.textSync('U-ANT', {
    horizontalLayout: 'fitted'
}));

function spinnerMessage(message, frame)
{
    return new ora({
        text: message,
        color: 'green',
        spinner: {
            interval: 500,
            frames: frame
        }
    }).start()
}

console.log(chalk.yellowBright(' "U Ant got no problem", A light weight tool to test latency and internet speeds! \n'))

function speedtest() {
    return new Promise(function(resolve, reject) {
        const test = speedTest({maxTime: 5000});
        test.on('data', data => {
            resolve(data);
        });
    });
}

async function pingAddresses(urls) {

    let allData = []

    // fetch all the URLs in parallel
    const pingPromises = urls.map(async url => {
        // TODO: I need to add a catch to handle a failed ping
        const response = await ping.promise.probe(url, {
            timeout: 10,
            min_reply: 10
        });
        return response;
    });

    // log them in sequence
    for (const pingPromise of pingPromises) {
        let list = await pingPromise
        allData.push(list);
    }

    // Return a Promise so i can get to the data once all asyncs are done
    return new Promise(function(resolve, reject) {
        resolve(allData)
    })
}

const spinner = spinnerMessage(' Checking latency, Please be patient!',  [' __', ' --', ' **']);
let Downloadspinner

pingAddresses(['202.142.142.142', '180.150.17.170', '1.1.1.1', 'google.com.au']).then(function(result) {
    spinner.stop();

    for (let index = 0; index < result.length; index++) {
        console.log(chalk.blue(result[index].host))
        console.log(chalk.green('  Minimum = ' + result[index].min + 'ms, Maximum = ' + result[index].max + 'ms, Average = ' + result[index].avg + 'ms \n'))
    }

    Downloadspinner = spinnerMessage(' Testing Speed, Please be patient!',  [' __', ' --', ' **']);
    return speedTest({maxTime: 5000})

}).then(function(result) {

    result.on('data', data => {
        Downloadspinner.stop();

        console.log(chalk.blue('Speedtest'))
        console.log(chalk.green('  Download = '+ data.speeds.download +'Mbps, Upload = '+ data.speeds.upload +'Mbps \n'))

        var userName = readlineSync.question('Close [ENTER] ');
        console.log('Finishing...');
    });
});
