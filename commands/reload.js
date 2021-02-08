module.exports = {
	name: 'reload',
	description: '해당 명령어를 재시작합니다',
    aliases: ['reload', 're', '리로드'],
    help: '리로드',
    dev: true,
	execute(client, message, args, prefix, knex) {
        if (!args.length) return message.reply(`다시 로드할 명령어를 입력해주세요!`) // 입력된 값이 없을시
        const commandName = args[0].toLowerCase() // 입력된 값 소문자로 변환
        const command = message.client.commands.get(commandName) 
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)) //입력된 이름의 명령어 불러오기
        
        if (!command) return message.reply(`\`${commandName}\`이라는 명령어를 찾지 못하였습니다!`) // 입력된 이름의 명령어가 없을시
        delete require.cache[require.resolve(`./${command.name}.js`)] // 입력된 명령어의 파일 삭제
        try {
            const newCommand = require(`./${command.name}.js`) // 명령어 파일 불러오기
            message.client.commands.set(newCommand.name, newCommand) // 명령어 다시 로드
            message.reply(`\`${command.name}\` 명령어가 리로드 되었습니다!`) // 확인 메시지 전송 
        } catch (error) { // 오류가 날 시
            console.error(error) // 콘솔에 오류 출력
            message.reply(`\`${command.name}\` 명령어를 다시 로드하는데 오류가 발생하였습니다!`) // 오류 메시지 전송
        }
	},
}