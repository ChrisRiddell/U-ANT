const figlet = require('figlet');
const chalk = require('chalk');
const speedTest = require('speedtest-net');
const { execSync } = require('child_process');
const { readFileSync } = require('fs');

console.log(figlet.textSync('U-ANT', {
    font: '3D-ASCII',
    horizontalLayout: 'fitted'
}));

console.log(chalk.yellowBright('"U Ant got no problem", A light weight tool to test latency and internet speeds! '))

let addressList = JSON.parse(readFileSync('addresses.json', 'utf8'));
let allData = []
for (let index = 0; index < addressList.length; index++) {
    //console.log(addressList[index])
    let pingData = execSync('ping -c 10 ' + addressList[index], {encoding: 'utf-8'})

    allData.push(pingData)
}

console.log(allData)
