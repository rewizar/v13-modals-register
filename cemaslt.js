const { Collection , Client, Modal, MessageActionRow, TextInputComponent, Intents, SelectMenuComponent } = require('discord.js');
const client = new Client({ intents: 32767 });
const fs = require('fs');
const db = require('quick.db');
const moment = require('moment');
require('moment-duration-format')
require('dotenv')
const {REST}  = require('@discordjs/rest');
const rest = new REST({ version: '9' }).setToken('');const commands = [];
require('./util/eventLoader.js')(client)
const settngs = require('./config.json');
global.messageDelete = (message) => setTimeout(() => { message?.delete() }, 5000)

client.commands = new Collection()
client.aliases = new Collection()
fs.readdir('./commands/', (Error, Files) => {
    if (Error) console.error(Error)
    console.log(`[cemaslt] ${Files.length} Adet Komut Yüklenecek!`)
    Files.forEach(Pepe => {
        let Props = require(`./commands/${Pepe}`)
        console.log(`[cemaslt] ${Props.help.name} Yüklendi.`)
        client.commands.set(Props.help.name, Props)
        Props.conf.aliases.forEach(Alias => {
            client.aliases.set(Alias, Props.help.name)
        })
    })
})

client.on('guildMemberAdd', async member => {
    member.guild.channels.cache.get(settngs['rol-kanal'].kayıtChat)?.send({
        content: `\`•\` Sunucuya hoş geldin ${member}! 🎉
\`•\` Sunucuya kayıt olmak için ses kanallarında teyit vermelisin <@&${settngs['rol-kanal'].kayıtSorumlusu}>.
\`•\` Hesabın \`${moment(member.user.createdAt).format('LLLL')}\` (\`${convertDate(member.user.createdAt)} önce\`) tarihinde oluşturulmuş 📅
\`•\` Sunucuya kayıt olduktan sonra "KURALLARI" okumayı unutma , uymayan kullanıcılara ceza işlemleri uygulanacak.`})
member.roles.add(settngs['rol-kanal'].kayıtsızRole)
member.roles.add(settngs['rol-kanal'].kayıtsızRole)
member.setNickname(`İsim | Yaş`)
});


client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    if (!interaction.member.roles.cache.has(settngs['rol-kanal'].kayıtSorumlusu)) return;
    if (interaction.customId.startsWith('register.')) {
        const user = interaction.customId.split('.')[1]
        const member = interaction.guild.members.cache.get(user)
        if (!member) return interaction.reply({ content: `Kullanıcıyı sunucuda bulamadım!`, ephemeral: true })
        if (!member.roles.cache.has(settngs['rol-kanal'].kayıtsızRole)) return interaction.reply({ content: `Kullanıcıda kayıtsız rolü yok!`, ephemeral: true })
        const modal = new Modal()
        .setCustomId(`kayıt.${user}`)
        .setTitle(`${member.user.tag} - Sunucu Kayıt`)
        .addComponents(
            new TextInputComponent()
                .setCustomId(`isim.${user}`)
                .setLabel('İsim')
                .setStyle('SHORT')
                .setMinLength(1)
                .setMaxLength(32)
                .setPlaceholder('Kullanıcı İsmini Giriniz.'),
            new TextInputComponent()
                .setCustomId(`yaş.${user}`)
                .setLabel('Yaş')
                .setStyle('SHORT')
                .setMinLength(1)
                .setMaxLength(2)
                .setPlaceholder('Kullanıcının Yaşını.'),
            new TextInputComponent()
                .setCustomId(`tür.${user}`)
                .setLabel('Kayıt Türü')
                .setStyle('SHORT')
                .setMinLength(1)
                .setMaxLength(1)
                .setPlaceholder('Erkek (e), Kadın(k)')
        )
    interaction.showModal(modal, {
        client: client,
        interaction: interaction
    })
    }


});


client.on('interactionCreate', async interaction  =>{
    if (!interaction.isModalSubmit()) return;
    if(interaction.customId.startsWith('kayıt')) {
        const userId = interaction.customId.split('.')[1]
        const user = interaction.guild.members.cache.get(userId)
        if (!user) return interaction.reply({ content: `Kullanıcıyı sunucuda bulamadım!`, ephemeral: true })
        if (!user.roles.cache.has(settngs['rol-kanal'].kayıtsızRole)) return interaction.reply({ content: `Kullanıcıda kayıtsız rolü yok!`, ephemeral: true })
    
        const isim = interaction.fields.getTextInputValue(`isim.${userId}`)
        const yaş = interaction.fields.getTextInputValue(`yaş.${userId}`)
        const tür = interaction.fields.getTextInputValue(`tür.${userId}`)?.toLowerCase()
        if (!isim) return interaction.reply({ content: ` Geçersiz isim tanımı.`, ephemeral: true })
        if (!yaş || isNaN(yaş)) return interaction.reply({ content: `} Geçersiz yaş tanımı (harf içeriyor olabilir).`, ephemeral: true })
        if (!tür || !['e', 'k'].includes(tür)) return interaction.reply({ content: `Geçersiz kayıt türü [Erkek(e), Kadın(k)].`, ephemeral: true })
        user.setNickname(`${settngs.other.kayıtSembol} ${isim} | ${yaş}`)
        user.roles.remove(settngs['rol-kanal'].kayıtsızRole)
        user.setNickname(`${settngs.other.kayıtSembol} ${isim} | ${yaş}`)
        user.roles.remove(settngs['rol-kanal'].kayıtsızRole)
        if (tür === 'e') {
            user.roles.add(settngs['rol-kanal'].erkek1)
            user.roles.add(settngs['rol-kanal'].erkek2)
            user.roles.add(settngs['rol-kanal'].erkek1)
            user.roles.add(settngs['rol-kanal'].erkek2)
            db.add(`Kayıte.${modal.user.id}`, 1)
        } else if (tür === 'k') {
            user.roles.add(settngs['rol-kanal'].kadın1)
            user.roles.add(settngs['rol-kanal'].kadın2)
            user.roles.add(settngs['rol-kanal'].kadın1)
            user.roles.add(settngs['rol-kanal'].kadın2)
            db.add(`Kayıtk.${modal.user.id}`, 1)

    }
    db.add(`Kayıt.${interaction.user.id}`, 1)
    db.add(`Kayıtg.${interaction.user.id}`, 1)
    db.push(`Nicks.${userId}`, `${isim} ${yaş} (${tür}) - \`${moment().format('LLLL')}\``)
    db.set(`Kayıtçı.${userId}`, { Register: interaction.user.id, Type: tür })
    db.set(`SonKayıt.${interaction.user.id}`, moment().format('LLLL'))
    interaction.reply({ embeds: [new Discord.MessageEmbed().setColor('#03fc07').setDescription(`${user} (**${userId}**) kullanıcısı sunucuya ${interaction.user} (**${interaction.user.id}**) tarafından kayıt edildi!`)] })
}


})

client.on('guildMemberRemove', async member => {
    if (db.has(`Kayıtçı.${member.user.id}`)) {
        const data = db.fetch(`Kayıtçı.${member.user.id}`)
        db.subtract(`Kayıt${data.Type}.${data.Register}`, 1)
        db.subtract(`Kayıtg.${data.Register}`, 1)
    }
})





client.login(settngs.bot.botToken)










//





global.convertDate = (date) => {
    const startedAt = Date.parse(date)
    var msecs = Math.abs(new Date() - startedAt)

    const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365))
    msecs -= years * 1000 * 60 * 60 * 24 * 365
    const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30))
    msecs -= months * 1000 * 60 * 60 * 24 * 30
    const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7))
    msecs -= weeks * 1000 * 60 * 60 * 24 * 7
    const days = Math.floor(msecs / (1000 * 60 * 60 * 24))
    msecs -= days * 1000 * 60 * 60 * 24
    const hours = Math.floor(msecs / (1000 * 60 * 60))
    msecs -= hours * 1000 * 60 * 60
    const mins = Math.floor((msecs / (1000 * 60)))
    msecs -= mins * 1000 * 60
    const secs = Math.floor(msecs / 1000)
    msecs -= secs * 1000

    var string = "";
    if (years > 0) string += `${years} yıl ${months} ay`
    else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks + " hafta" : ""}`
    else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days + " gün" : ""}`
    else if (days > 0) string += `${days} gün ${hours > 0 ? hours + " saat" : ""}`
    else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins + " dakika" : ""}`
    else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs + " saniye" : ""}`
    else if (secs > 0) string += `${secs} saniye`
    else string += `saniyeler`

    string = string.trim()
    return `${string}`



}