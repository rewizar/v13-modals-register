const { MessageActionRow, MessageButton } = require('discord.js');
const settngs = require('../config.json');
const db = require('quick.db')

exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has(settngs['rol-kanal'].kayıtSorumlusu) && !message.member.roles.cache.has(settngs['rol-kanal'].TümYetkilerAçık)) return;
    if (message.channel.id !== settngs['rol-kanal'].kayıtChat) return message.channel.send({ content: `Bu komut bu kanalda çalışmaz !` }).then(message => messageDelete(message))
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.channel.send({ content: `Bir Kullanıcı belirt ! @cemaslt/477902114132066306` }).then(message => messageDelete(message))
    if (member.id === message.author.id) return message.channel.send({ content: `Knedini kayıt edemezsin !` }).then(message => messageDelete(message))
    if (member.id === client.user.id) return message.channel.send({ content: `Bot kayıt edilemez !` }).then(message => messageDelete(message))
    const row = new MessageActionRow()
       .addComponents(
          new MessageButton()
             .setCustomId(`register.${member.id}`)
             .setEmoji('🌴')
             .setLabel('KULLANICIYI KAYIT ET !')
             .setStyle('SECONDARY')
       )
    message.channel.send({ components: [row] })
 }
 
 exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['kayıt', 'k', 'e', 'erkek','kız'],
    permLevel: 0
 }
 
 exports.help = {
    name: 'Kayıt',
    description: 'kullanıcı kayıt et',
    usage: 'kayıt'
 }
