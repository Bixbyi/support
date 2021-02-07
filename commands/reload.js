module.exports = {
	name: 'reload',
	description: '해당 명령어를 재시작합니다',
    aliases: ['reload', 're', '리로드'],
    dev: true,
	execute(client, message, args, prefix) {
        if (!args.length) return message.reply(`다시 로드할 명령어를 입력해주세요!`)
        const commandName = args[0].toLowerCase()
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
        
        if (!command) return message.reply(`\`${commandName}\`이라는 명령어를 찾지 못하였습니다!`)
        delete require.cache[require.resolve(`./${command.name}.js`)]
        try {
            const newCommand = require(`./${command.name}.js`)
            message.client.commands.set(newCommand.name, newCommand)
            message.reply(`\`${command.name}\` 명령어가 리로드 되었습니다!`)
        } catch (error) {
            console.error(error)
            message.reply(`\`${command.name}\` 명령어를 다시 로드하는데 오류가 발생하였습니다!`)
        }
	},
}