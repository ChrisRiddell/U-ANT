/**
 *  U-ANT 🐜
 * "u ant got no problems", A light weight tool to test latency and download speeds.
 */

const figlet = require('figlet')
const chalk = require('chalk')
// const speedTest = require('speedtest-net')
// const ping = require('ping')
const { prompt } = require('prompts')
const axios = require('axios')

console.log(figlet.textSync('U-ANT', {
  horizontalLayout: 'fitted'
}))

console.log(chalk.yellowBright(' "U Ant got no problem", A light weight tool to test latency and internet speeds! \n'))

const mainMenu = [
  {
    type: 'select',
    name: 'options',
    message: 'Pick an option',
    choices: [
      { title: 'Register', value: 'register' },
      { title: 'Login', value: 'login' }
    ],
    initial: 1
  }
]

const registerMenu = [
  {
    type: 'toggle',
    name: 'tos',
    message: 'Have you read the Terms of Service https://uant.riddell.id.au/tos ?',
    initial: false,
    active: 'yes',
    inactive: 'no'
  },
  {
    type: prev => prev === true ? 'text' : null,
    name: 'email',
    message: 'Email'
  }
]

const loginMenu = [
  {
    type: 'password',
    name: 'password',
    message: 'Your Password'
  },
  {
    type: prev => {
      return axios({
        method: 'get',
        url: 'http://localhost:8268/users',
        headers: { 'Content-Type': 'application/json', 'x-auth': prev }
      })
        .then(function () {
          return 'select'
        })
        .catch(function () {
          displayBlock('red', ['Password provided was not vaild.'])
          return null
        })
    },
    name: 'authoptions',
    message: 'Pick an option',
    choices: [
      { title: 'Change Results URL', value: 'changePublicKey' },
      { title: 'Change Password', value: 'changePrivateKey' },
      { title: 'Show Results URL', value: 'showPublicKey' },
      { title: 'Run Service', value: 'runService' }
    ],
    initial: 3
  }
]

async function runUANT() {
  const mainMenuItems = await prompt(mainMenu)
  if (mainMenuItems.options === 'register') {
    const registerMenuItems = await prompt(registerMenu)
    if (registerMenuItems.tos === true) {
      axios({
        method: 'post',
        url: 'http://localhost:8268/users',
        headers: { 'Content-Type': 'application/json' },
        data: {
          email: registerMenuItems.email
        }
      }).then(function (response) {
        displayBlock('green', ['Password', `    ${response.data.privateKey}`, 'Results URL', `    https://uant.riddell.id.au/results/${response.data.publicKey}`])
      }).catch(function (error) {
        if (error.response.data.error) {
          displayBlock('red', [`${error.response.data.error.message}`])
        }
      })
    }
  }

  if (mainMenuItems.options === 'login') {
    const loginMenuItems = await prompt(loginMenu)

    if (loginMenuItems.authoptions) {
      switch (loginMenuItems.authoptions) {
        case 'changePublicKey':
          axios({
            method: 'put',
            url: 'http://localhost:8268/users/publickey',
            headers: { 'Content-Type': 'application/json', 'x-auth': loginMenuItems.password },
            data: { }
          })
            .then(function (response) {
              displayBlock('green', [`New Results URL \n    https://uant.riddell.id.au/results/${response.data.publicKey}`])
            })
            .catch(function (error) {
              if (error.response.data.error) {
                displayBlock('red', [`${error.response.data.error.message}`])
              }
            })
          break
        case 'changePrivateKey':
          axios({
            method: 'put',
            url: 'http://localhost:8268/users/privatekey',
            headers: { 'Content-Type': 'application/json', 'x-auth': loginMenuItems.password },
            data: { }
          })
            .then(function (response) {
              displayBlock('green', [`New Password \n    ${response.data.privateKey}`])
            })
            .catch(function (error) {
              if (error.response.data.error) {
                displayBlock('red', [`${error.response.data.error.message}`])
              }
            })
          break
        case 'showPublicKey':
          axios({
            method: 'get',
            url: 'http://localhost:8268/users/publickey',
            headers: { 'Content-Type': 'application/json', 'x-auth': loginMenuItems.password },
            data: { }
          })
            .then(function (response) {
              displayBlock('green', [`Results URL \n    https://uant.riddell.id.au/results/${response.data.publicKey}`])
            })
            .catch(function (error) {
              if (error.response.data.error) {
                displayBlock('red', [`${error.response.data.error.message}`])
              }
            })
          break
        case 'runService':
          displayBlock('blueBright', ['Running...', '    Results will be logged every 3 hours', '    Do not close this window'])

          setInterval(function () {

          }, 5000)

          break
      }
    }
  }
}

function displayBlock (colour, messages) {
  console.log(chalk[colour]('----------------------------------------------------------------------------'))
  for (var m of messages) {
    console.log(chalk[colour](m))
  }
  console.log(chalk[colour]('----------------------------------------------------------------------------'))
  runUANT()
}

runUANT()
