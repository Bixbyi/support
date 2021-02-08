module.exports = {
	name: 'profile',
	description: '자신의 프로필을 보여줍니다!',
    aliases: ['avatar', 'profile', '프로필', '아바타', '프사', '프로필사진'],
	usage: '<user>',
	help: '프로필',
	execute(client, message, args, prefix, knex) {
		let user; // 빈 변수 생성
		if (args.length===0) user = message.author // 입력된 값이 없다면 메시지를 보낸 사람
        if (message.mentions.members.first()) user = message.mentions.members.first().user // 맨션이 있다면 맨션한 유저
     if (isNaN(args[0]) == false) user = client.users.cache.get(args[0]) // 입력된 값이 숫자(아이디)면 아이디 유저
		const Discord = require('discord.js') // 모듈 불러오기
		const embed = new Discord.MessageEmbed() // 임베드 생성
		embed.setTitle(`${user.username}님의 프로필입니다!`) // 임베드 타이틀
		embed.setImage(user.displayAvatarURL({ format: "png", size: 1024 })) // 프로필 이미지(png, 1024크기)
		return message.reply(embed) // 메시지 전송
	},
};