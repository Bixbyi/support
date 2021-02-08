module.exports = {
	name: 'help',
	description: '명령어의 도움말을 보여줍니다!',
    aliases: ['도움말', '도움', 'help'],
    help: '도움말',
	execute(client, message, args, prefix, knex) {
        const data = [] // 빈  문자열 생성
        const { commands } = message.client // 명령어 불러오기
        if(!args[0]) { // 추가 입력이 없다면
        data.push('명령어 리스트입니다!') // 제목
        data.push(commands.map(command => `\`\`${command.help}\`\``).join(', ')) // 명령어 입력
        data.push(`\n더 자세한 명령어 도움말을 알고 싶다면 \`${prefix}도움말 [command name]\``) // 도움말 부가 명령어 안내
            
        return message.reply(data, { split: true }) // 메시지 전송
        }
        if(args[0]) { // 추가 입력이 있다면
        const name = args[0].toLowerCase() // 입력된 값 소문자로 반환
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name)) // 입력된 이름의 명령어 불러오기
        
        if (!command) { // 입력된 이름의 명령어가 없다면
            return message.reply(`${args} 라는 명령어를 찾지 못하였습니다!`) // 메시지 전송
        }
        
        data.push(`**이름:** ${command.help}`) // 제목
        
        if (command.aliases) data.push(`**별칭:** ${command.aliases.join(', ')}`) // 별칭
        if (command.description) data.push(`**설명:** ${command.description}`) // 설명
        if (command.usage) data.push(`**사용법:** ${prefix}${command.name} ${command.usage}`) // 사용법
        if(command.cooldown) data.push(`**쿨타임:** ${command.cooldown} 초`) //쿨타임
        
        message.reply(data, { split: true }) // 메시지 전송
    }
	},
}