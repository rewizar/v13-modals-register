const settngs = require('../config.json')
const db = require('quick.db');

exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has(settngs['rol-kanal'].kayıtSorumlusu) && !message.member.roles.cache.has(settngs['rol-kanal'].TümYetkilerAçık)) return;    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.channel.send({ content: `Bir kullanıcıya ait ID gir ya da etiketle! @cemaslt/id` }).then(message => messageDelete(message))
    if (member.id === client.user.id) return message.channel.send({ content: `Birşeyler ters gitti` }).then(message => messageDelete(message))
    if (!message.guild.members.cache.get(member.id)) return message.channel.send({ content: ` Bu kullanıcı sunucuda değil!` }).then(message => messageDelete(message))
    message.guild.members.cache.get(member.id).setNickname('Kayıtsıza Atıldı')
    db.delete(`Nicks.${member.id}`)
    db.delete(`Kayıtçı.${member.id}`)
    message.guild.members.cache.get(member.id).roles.cache.filter(role => role.name !== '@everyone').map(x => message.guild.members.cache.get(member.id).roles.remove(x.id))
    message.guild.members.cache.get(member.id).roles.add(settings.guild.roles.unRegistered)
    message.channel.send({ content: `${member.user.tag} başarıyla kayıtsıza atıldı!` }).then(message => messageDelete(message))
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['kayıtsız'],
    permLevel: 0
}

exports.help = {
    name: 'Kayıtsız',
    description: 'Üyeyi kayıtsıza atar',
    usage: 'kayıtsız'
}
