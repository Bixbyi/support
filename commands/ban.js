module.exports = {
	name: 'ban',
	description: '멤버를 밴 합니다!',
    aliases: ['밴', '벤', 'ban', '차단'],
    help: '밴',
    permissions: 'BAN_MEMBERS',
	execute(client, message, args, prefix, knex) {
        const user = message.mentions.users.first() || args[0]//맨션 or 유저 아이디
        if(!user) return message.reply('밴 할 유저를 맨션 이나 아이디를 적어주세요!') //유저 값이 없을시
        let member = message.mentions.users.first().id; // 멤버는 맨션한 사람의 아이디
        if(!message.mentions.users.first()) member = args[0]; // 맨션을 안했다면 유저 아이디
        if(!message.mentions.users.first() && !client.users.cache.get(args[0]))  return message.reply('정확한 유저의 아이디를 적어주세요!')// 알맞지 않은 유저의 아이디를 입력했을시 
        if(!message.guild.members.cache.get(member)) return message.reply('이 서버에 없는 유저입니다!') // 이 서버에 있는 유저가 아닐 시
        const reason = args[1] ? args[1] : "사유 없음" // 사유가 있으면 적은 사유로, 없으면 "사유없음" 으로
        if(!message.guild.me.hasPermission("BAN_MEMBERS")) return message.reply('저의 권한이 너무 낮습니다!') // 봇의 권한 확인
        message.guild.members.ban(user, {reason: reason}) // 유저 밴
        const name = message.mentions.users.first() ? message.mentions.users.first().tag : client.users.cache.get(args[0]).tag // 이름 확인
        message.reply(`${name} 님을 밴 하였습니다!\n사유: ${reason}`)// 확인 메시지 전송
    }
}