const Discord = require('discord.js')
const settngs = require('../config.json');
const db = require('quick.db')

exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has(settngs['rol-kanal'].kayıtSorumlusu) && !message.member.roles.cache.has(settngs['rol-kanal'].TümYetkilerAçık)) return;    
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.channel.send({ content: `Bir kullanıcıya ait ID gir ya da etiketle! @cemaslt/id` }).then(message => messageDelete(message))
    if (member.id === client.user.id) return message.channel.send({ content: `Botun isimlerini kontrol edemezsin!` }).then(message => messageDelete(message))
    if (!message.guild.members.cache.get(member.id)) return message.channel.send({ content: `Bu kullanıcı sunucuda değil!` }).then(message => messageDelete(message))

    const Embed = new Discord.MessageEmbed()
        .setColor('#5865F2')
        .setTitle(`${member.user.tag} - İsimleri (${db.has(`Nicks.${member.user.id}`) ? db.fetch(`Nicks.${member.user.id}`).length : 0})`)
        .setDescription(db.has(`Nicks.${member.user.id}`) ? db.fetch(`Nicks.${member.user.id}`).join('\n') : 'Bu kullanıcıya ait hiç isim kayıtlı değil!')
        .setFooter({ text: `${settngs.bot.botFooter}`})
        .setTimestamp()
    message.channel.send({ embeds: [Embed] })
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['isimler', 'nicks'],
    permLevel: 0
}

exports.help = {
    name: 'eskiisimler',
    description: 'Sunucuya yeni bir üyenin isimlerini kontrol etmek için kullanılır.',
    usage: 'isimler'
}
