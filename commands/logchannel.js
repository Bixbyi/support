module.exports = {
	name: 'logchannel',
	description: '로그를 보낼 채널을 설정합니다!',
    aliases: ['로그채널', 'logchannel', '로그', 'log'],
    help: '로그채널',
    permissions: 'ADMINISTRATOR',
	async execute(client, message, args, prefix, knex) {
        const channel = message.mentions.channels.first() // 채널 맨션 확인
        if(!channel) return message.reply('로그채널로 설정할 채널을 맨션해주세요!') // 채널을 맨션 안했을 시
        await knex('event').update({ logchannel: channel.id }).where({ id: message.guild.id}) // DB에 저장
        .then(() => {
            message.reply(`${channel}을 로그 채널로 설정하였습니다!`) // 확인 메시지 전송
        })
    }
    }