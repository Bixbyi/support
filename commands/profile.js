module.exports = {
	name: 'profile',
	description: '자신의 프로필을 보여줍니다!',
    aliases: ['avatar', 'profile', '프로필', '아바타', '프사', '프로필사진'],
	usage: '<user>',
	help: '프로필',
	execute(client, message, args, prefix, knex) {
		//프로필 사진을 보여줄 유저 찾기
		let user;
		if (args.length===0) user = message.author
        if (message.mentions.members.first()) user = message.mentions.members.first().user
     	if (isNaN(args[0]) == false) user = client.users.cache.get(args[0])
		const Discord = require('discord.js')
		//임베드
		const embed = new Discord.MessageEmbed()
		embed.setTitle(`${user.username}님의 프로필입니다!`)
		embed.setImage(user.displayAvatarURL({ format: "png", size: 1024 })) // 프로필 이미지(png, 1024크기)
		return message.reply(embed)
	},
};