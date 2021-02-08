module.exports = {
	name: 'ping',
	description: '봇의 핑을 보여줍니다!',
	help: '핑',
    aliases: ['ping', 'pong', '핑', '퐁'],
	execute(client, message, args, prefix, knex) {
		message.reply("핑 측정중...").then((m) => { // 측정 메시지 전송
		m.edit(`퐁!\nAPI지연시간: ${client.ws.ping}ms!\n봇지연시간: ${m.createdTimestamp - message.createdTimestamp}ms!`) // 결과 메시지 전송
		})
	},
};