module.exports = {
	name: 'eval',
	description: '실행',
    aliases: ['실행', 'eval'],
    help: '실행',
    dev: true,
   async execute(client, message, args, prefix, knex) {
        const { inspect } = require('util') // 모듈 불러오기
        const Discord = require('discord.js') // 모듈 불러오기
        const arg = message.content.replace(prefix, "").split(" ").slice(1).join(" ") // 넣을 값 불러오기
        if(arg.includes('client.token') || arg.includes('process.exit')) return message.reply('``Inaccess ible motion``') //토큰 및 봇 끄기 방지
        try {
            const evaled = inspect(eval(arg), { depth: 0}) // 값 계산
            let embed = new Discord.MessageEmbed() //임베드 생성
            embed.setTitle('실행') // 임베드 제목
            embed.addField(`input`, `\`\`\`js\n${arg}\`\`\``) // eval input
            embed.addField(`output`, `\`\`\`js\n${evaled}\`\`\``) // eval output
            embed.addField(`Type of`, `\`\`\`${typeof(evaled)}\`\`\``) // eval type
            message.channel.send(embed) // 확인 메시지 전송
        } catch (error) { // 오류가 나면
            let embed = new Discord.MessageEmbed() // 임베드 생성
            embed.setTitle(`실행 에러`) // 임베드 제목
            embed.addField(`error`, `${error}`) // 오류 내용
            message.channel.send(embed) // 오류 메시지 전송
        }
	},
}