module.exports = {
	name: 'welcome',
	description: '멤버가 입장했을때 보낼 채널 / 메시지를 설정합니다!',
    aliases: ['입장', 'welcome', '환영'],
    help: '입장',
    permissions: 'ADMINISTRATOR',
	async execute(client, message, args, prefix, knex) {
        if(args.includes('채널')) { // 채널설정
            const channel = message.mentions.channels.first() // 맨션한 채널 확인
            if(!channel) return message.reply('입장채널로 설정할 채널을 맨션해주세요!') // 채널을 맨션 안했을 시
            await knex('event').update({ welcomechannel: channel.id }).where({ id: message.guild.id}) // DB에 저장
            .then(() => {
                message.reply(`${channel}을 입장채널로 설정하였습니다!`) // 확인 메시지 전송
            })
        }
        if(args.includes('메시지')) { // 메시지 설정1
            const text =  message.content.replace(prefix, '').split(' ').splice(2).join(' ') // 메시지 확인
            if(!text) return message.reply('입장 메시지로 설정할 메시지를 적어주세요!') // 메시지를 안적었을시
            await knex('event').update({ welcomemessage: text }).where({ id: message.guild.id}) // DB에 저장
            .then(() => {
                message.reply(`입장 메시지를 \n**${text}**\n로 설정하였습니다!`) // 확인 메시지 전송
            })
        }
        else if(!args[0] == '채널' && !args[0] == '메시지') {
            message.reply(`올바른 사용법: ${prefix}입장 <채널 / 메시지>`) // 채널, 메시지 중 다른것을 말 했을시
        }
    }
    }