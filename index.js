const { prefix, token, dev, DB } = require('./config.json') // config.json 에서 접두사, 토큰, 개발자, 디비 불러오기
const knex = require("knex")({
    client: DB.client,
    connection: {
      host: DB.connection.host,
      user: DB.connection.user,
      password: DB.connection.password,
      database: DB.connection.database,
    },
  }) // DB 에 연결
const Discord = require('discord.js') // discord 모듈 불러오기
const { Intents } = require('discord.js') // discord 모듈에서 Intensts 불러오기
const client = new Discord.Client({  ws: { intents: Intents.ALL } }) // client 생성(인텐츠 모두 활성화)
client.login(token) // client 로그인
client.on('ready', () => { // client 가 켜젔을시
    console.log(`${client.user.tag}is Ready`) // 콘솔에 출력
})
const cooldowns = new Discord.Collection() // 쿨다운 컬렉션 생성
client.commands = new Discord.Collection() // client command 에 컬렉션 생성
client.on('message', (message) => { // 메시지를 감지할시
    if (!message.content.startsWith(prefix) || message.author.bot) return // 접두사로 시작 안하거나 봇이면 return
    const fs = require('fs') // fs 모듈 불러오기
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')) // commands 파일에서 .js 로 끝나는 파일 불러오기
    for (const file of commandFiles) { 
        const command = require(`./commands/${file}`) // 명령어는 commands 파일 안에 있는 파일 이름
        client.commands.set(command.name, command) // client.commands 를 명령어 이름과 위에 command 로 설정
    }
    const args = message.content.slice(prefix.length).trim().split(/ +/) //args 는 접두사를 제외한 나머지
	const commandName = args.shift().toLowerCase() // args 에서 첫번째 요소(명령어) 제거한 후 소문자로 반환
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)) // 명령어 불러오기
	if (!command) return // 명령어가 없다면 return
    	if (command.args && !args.length) { // 명령어에 args 가 있어야 되는데 없다면
            let reply = `인수를 제공하지 않았습니다, ${message.author}!` // 메시지 전송
            		if (command.usage) {
            			reply += `\n올바른 사용법: \`${prefix}${command.name} ${command.usage}\`` // 명령에 usage 가 있다면 메시지 전송
            		}
            		return message.reply(reply) // reply 메시지를 전송하고 return
    	}
        if (message.channel.type === 'dm') { // dm채널에서 명령어를 쓰면 return
            return // 막고 싶지 않다면 39~41번 줄 삭제
        }
        if (command.guildOnly && message.channel.type === 'dm') { // 명령어 guildOnly 가 true 이고 dm채널에서 명령어를 쓰면
          return message.reply('이 명령어는 DM 에서 사용 불가능합니다!') // 메시지 전송
        }
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection())
        }
        const now = Date.now()
        const timestamps = cooldowns.get(command.name)
        const cooldownAmount = (command.cooldown || 3) * 1000 // 명령어의 cooldown 이 쿨타임 초, 없다면 기본 3초
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount
        
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000
                return message.reply(`${timeLeft.toFixed(1)} 초 뒤에 \`${command.help}\` 명령어를 사용해주세요!`) // 쿨타임이 지나기 전에 메시지를 쓰면
            }
        }
        timestamps.set(message.author.id, now)
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount) // 쿨타임 시간이 지나면 값 삭제
         if (command.permissions) {// 명령어에 permissions 가 있으면
             	const authorPerms = message.channel.permissionsFor(message.author) // 메시지를 감지한 채널에 메시지를 쓴 유저 권한 불러오기
             	if (!authorPerms || !authorPerms.has(command.permissions)) { // 권한이 낮거나 부족하면 
             		return message.reply(`이 명령어를 사용할 권한이 부족합니다!\n필요한 권한: ${command.permissions}`) // 메시지 전송
             	}
             }
             if(!dev.includes(message.author.id) && command.dev) { // 개발자가 아니고 명령어에 dev 가 true 이면
                 return message.reply('이 명령어는 개발자만 가능합니다!') // 메시지 전송
             }
	try {
		command.execute(client, message, args, prefix, knex) // 명령어에 이러한 걸 전송
	}catch(error) { // 오류가 나면
        console.log(error) // 콘솔에 오류 출력
    }
})
client.on('messageUpdate', async (message, oldMessage) => { // 메시지가 수정되면
    if(message.author.bot) return // 봇이면 return
    if(oldMessage.content == message.content) return // 수정 전과 후가 같으면 return(gif & 이미지 방지)
  const guild = (await knex.select('*').from('event').where({ id: message.guild.id }))[0].logchannel // DB 에서 로그 채널 불러오기
  if(!guild) return // 로그채널이 설정되어있지 않으면 return
  const channel = message.guild.channels.cache.get(guild) // 서버에서 로그 채널 불러오기
  const embed = new Discord.MessageEmbed() // 임베드 생성
  embed.setTitle('메시지수정로그') // 임베드 제목
  embed.addFields({ name: '메시지주인', value: `${message.author}`}, // 메시지를 수정한 유저
    { name: '채널', value: `${message.channel}`}, // 메시지가 수젇된 채널
    { name: '메시지바로가기', value: `[클릭](${message.url})`}, // 메시지 바로 가기 링크
    { name: '변경전', value: `${message.content}`}, // 변경전 메시지
    { name: '변경후', value: `${oldMessage}`},) // 변경 후 메시지
    embed.setThumbnail(`${message.author.displayAvatarURL()}`) // 임베드 썸네일은 메시지를 수정한 유저의 프로필
  embed.setFooter(`${message.author.tag}`, message.author.displayAvatarURL()) //임베드 바닥글은 메시지를 수정한 유저의 태그와 프로필
  embed.setTimestamp(new Date()) // 시간
  embed.setColor("#93bfe6") // 색깔
  channel.send(embed) //임베드 전송
  .catch(() => { // 메시지가 1024글자보다 넘을때 (임베드 필드 최대 값)
    const embed = new Discord.MessageEmbed() // 임베드 생성
    embed.setTitle('메시지삭제로그') // 임베드 제목
    embed.addFields(
      { name: '메시지주인', value: `${message.author}`}, // 메시지를 수정한 유저
      { name: '채널', value: `${message.channel}`}, // 메시지가 수정된 채널
      { name: '메시지바로가기', value: `[클릭](${message.url})`}, // 메시지 바로 가기 링크
      { name: '삭제내용', value: `메시지가 너무 길어 불러오지 못하였습니다!`}, // 오류 방지 안내
    )
    embed.setThumbnail(`${message.author.displayAvatarURL()}`) // 임베드 썸네일은 메시지를 수정한 유저의 프로필
    embed.setFooter(`${message.author.tag}`, message.author.displayAvatarURL()) // 임베드 바닥글은 메시지를 수정한 유저의 태그와 프로필
    embed.setTimestamp(new Date()) // 시간
    embed.setColor("#93bfe6") // 색깔
    return channel.send(embed) // 임베드 전송
  })}) 
  client.on('messageDelete', async (message) => { // 메시지가 삭제되면
    const guild = (await knex.select('*').from('event').where({ id: message.guild.id }))[0].logchannel // DB에서 로그 채널 불러오기
  if(!guild) return // 로그 채널이 없으면 return
    const channel = message.guild.channels.cache.get(guild) // 메시지가 삭제된 서버에서 로그 채널 불러오기
    const { MessageAttachment } = require('discord.js') // discord 모듈에서 MessageAttachment 불러오기
    const fetch = require('node-fetch') // node-fetch 모듈 불러오기
  if(message.author.bot) return // 봇이면 return
  if(message.attachments.array().length > 0) {
    try {
        const result = await fetch(message.attachments.array()[0].proxyURL)
        if (!result.ok) {
        const embed = new Discord.MessageEmbed() // 임베드 생성
        embed.setTitle('메시지삭제로그') // 임베드 제목
        embed.addFields({ name: '메시지주인', value: `${message.author}`}, // 파일을 삭제한 유저
          { name: '채널', value: `${message.channel}`}, // 파일이 삭제된 채널
          { name: '삭제내용', value: `파일`},) // 파일은 캐시되지 않아서 다시 전송 X
        embed.setThumbnail(`${message.author.displayAvatarURL()}`) // 썸네일은 파일을 삭제한 유저의 프로필
        embed.setFooter(`${message.author.tag}`, message.author.displayAvatarURL()) // 임베드 바닥글은 파일을 삭제한 유저의 태그와 프로필
        embed.setTimestamp(new Date()) // 시간
        embed.setColor("#93bfe6") // 색깔
        return channel.send(embed) // 임베드 전송
      }
        const avatar = await result.buffer()
        const attachment = new MessageAttachment(avatar, message.attachments.array()[0].name) // 사진 링크
        if(message.content.length == 0) {
          const embed = new Discord.MessageEmbed() // 임베드 생성
          embed.setTitle('메시지삭제로그') // 제목
          embed.addFields(
            { name: '메시지주인', value: `${message.author}`}, // 이미지 삭제 
            { name: '채널', value: `${message.channel}`}, // 이미지
            { name: '삭제내용', value: `사진`}, // 삭제 내용 
          )
          embed.setThumbnail(`${message.author.displayAvatarURL()}`)// 썸네일은 이미지를 삭제한 유저의 프로필
          embed.setFooter(`${message.author.tag}`, message.author.displayAvatarURL()) // 임베드 바닥글은 이미지를 삭제한 유저의 태그와 프로필
          embed.setTimestamp(new Date()) // 시간
          embed.setColor("#93bfe6") // 색깔
          channel.send(embed) // 임베드 전송
          return channel.send(attachment) // 삭제된 이미지 전송
        }
        else {
          const embed = new Discord.MessageEmbed() // 임베드 생성
          embed.setTitle('메시지삭제로그') // 제목
          embed.addFields(
            { name: '메시지주인', value: `${message.author}`}, // 메시지 삭제 유저
            { name: '채널', value: `${message.channel}`}, // 메시지가 삭제된 채널
            { name: '삭제내용', value: `${message.content}`}, // 삭제된 메시지 내용
          )
          embed.setThumbnail(`${message.author.displayAvatarURL()}`) //  썸네일은 메시지를 삭제한 유저의 프로필
          embed.setFooter(`${message.author.tag}`, message.author.displayAvatarURL()) // // 임베드 바닥글은 메시지를 삭제한 유저의 태그와 프로필
          embed.setTimestamp(new Date()) // 시간
          embed.setColor("#93bfe6") // 색깔
          return channel.send(embed) // 임베드 전송
      }
    } 
    catch (e) { // 오류가 나면
      return console.log(e) // 콘솔에 오류 출력
    }
}
        const embed = new Discord.MessageEmbed() // 임베드 생성
        embed.setTitle('메시지삭제로그') // 제목
        embed.addFields(
          { name: '메시지주인', value: `${message.author}`}, // 메시지 삭제 유저
          { name: '채널', value: `${message.channel}`}, // 메시지가 삭제된 채널
          { name: '삭제내용', value: `${message.content}`}, // 삭제된 메시지 내용
        )
        embed.setThumbnail(`${message.author.displayAvatarURL()}`) //  썸네일은 메시지를 삭제한 유저의 프로필
        embed.setFooter(`${message.author.tag}`, message.author.displayAvatarURL())// 임베드 바닥글은 메시지를 삭제한 유저의 태그와 프로필
        embed.setTimestamp(new Date()) // 시간
        embed.setColor("#93bfe6") // 색깔
        return channel.send(embed) // 임베드 전송
        .catch(() => { // 삭제된 메시지가 1024(임베드 필드 최대 길이)가 넘으면
            const embed = new Discord.MessageEmbed() // 임베드 생성
            embed.setTitle('메시지삭제로그') // 제목
            embed.addFields(
              { name: '메시지주인', value: `${message.author}`}, // 메시지 삭제 유저
              { name: '채널', value: `${message.channel}`}, // 메시지가 삭제된 채널
              { name: '삭제내용', value: `메시지가 너무 길어 불러오지 못하였습니다!`}, // 오류 안내 내용
            )
            embed.setThumbnail(`${message.author.displayAvatarURL()}`) //  썸네일은 메시지를 삭제한 유저의 프로필
            embed.setFooter(`${message.author.tag}`, message.author.displayAvatarURL()) // 임베드 바닥글은 메시지를 삭제한 유저의 태그와 프로필
            embed.setTimestamp(new Date()) // 시간
            embed.setColor("#93bfe6") // 색깔
            return channel.send(embed) // 임베드 전송
          })
        })
        client.on('guildMemberAdd', async (member) => { // 서버에 유저가 들어오면
            const guild = (
              await knex('event')
                  .where({ id: member.guild.id })
          )[0] // DB 불러오기
          if(!guild) return // DB값이 없으면 return
          if(!guild.welcomechannel) return // 입장채널 설정이 안되있으면 return
          if(!guild.welcomemessage) return // 입장메시지 설정이 안되있으면 return
            const channel = member.guild.channels.cache.get(guild.welcomechannel) // 유저가 들어온 서버에서 입장 채널 불러오기
            const welcomemessage = guild.welcomemessage.replace('{유저}', member) // "{유저}" 를 들어온 유저 맨션으로 바꾸기
            const result = welcomemessage.replace('{서버}', member.guild.name) // "{서버}" 를 유저가 들어온 서버 이름으로 바꾸기
            channel.send(result.replace('{유저수}', member.guild.memberCount)) // "{유저수}" 를 유저가 들어온 서버 유저 수 바꾸기 및 메시지 전송
        })
        client.on('guildMemberRemove', async (member) => { // 서버에 유저가 나가면
          const guild = (
            await knex('event')
                .where({ id: member.guild.id })
        )[0] // DB 불러오기
        if(!guild) return // DB값이 없으면 return
        if(!guild.byechannel) return // 퇴장채널 설정이 안되있으면 return
        if(!guild.byemessage) return // 퇴장메시지가 설정이 안되있으면 return
          const channel = member.guild.channels.cache.get(guild.byechannel) // 유저가 나간 서버에서 퇴장 채널 불러오기
          const byemessage = guild.byemessage.replace('{유저}', member)  // "{유저}" 를 나간 유저 맨션으로 바꾸기
          const result = byemessage.replace('{서버}', member.guild.name) // "{서버}" 를 유저가 나간 서버 이름으로 바꾸기
          channel.send(result.replace('{유저수}', member.guild.memberCount)) // "{유저수}" 를 유저가 나간 서버 유저 수로 바꾸기 및 메시지 전송
        })