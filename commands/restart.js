module.exports = {
	name: 'restart',
	description: '봇을 재시작합니다!',
    aliases: ['restart', '재시작', '제시작'],
	help: '재시작',
    dev: true,
	execute(client, message, args, prefix, knex) {
		message.reply(`${message.guild.shard.id}번의 샤드를 재시작합니다!`).then(() => { // 안내 메시지 전송
            process.exit() // 재시작 (샤드)
        })
	},
};