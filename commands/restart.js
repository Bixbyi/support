module.exports = {
	name: 'restart',
	description: '봇을 재시작합니다!',
    aliases: ['restart', '재시작'],
    dev: true,
	execute(client, message, args, prefix) {
		message.reply(`${message.guild.shard.id}번의 샤드를 재시작합니다!`).then(() => {
            process.exit()
        })
	},
};