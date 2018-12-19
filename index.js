const figlet = require('figlet');
const chalk = require('chalk');
const speedTest = require('speedtest-net');
const { execSync } = require('child_process');

console.log(figlet.textSync('U-ANT', {
    font: '3D-ASCII',
    horizontalLayout: 'fitted'
}));

