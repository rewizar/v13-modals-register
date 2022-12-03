const Discord = require('discord.js')
const settngs = require('../config.json');
module.exports = async (client) => {

  client.user.setActivity(`${settngs.bot.botStatus}`, { type: 'PLAYING' })
  console.log(`[cemaslt] Bot sunucun için hazır!`)
  setInterval(() => {
    client.user.setActivity(`${settngs.bot.botStatus}`, { type: 'PLAYING' })
  }, 60000)
}