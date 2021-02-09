module.exports = {
  name: "help",
  description: "명령어의 도움말을 보여줍니다!",
  aliases: ["도움말", "도움", "help"],
  help: "도움말",
  execute(client, message, args, prefix, knex) {
    const data = [];
    const { commands } = message.client;
    if (!args[0]) {
      data.push("명령어 리스트입니다!");
      data.push(
        commands.map((command) => `\`\`${command.help}\`\``).join(", ")
      );
      data.push(
        `\n더 자세한 명령어 도움말을 알고 싶다면 \`${prefix}도움말 [command name]\``
      );

      return message.reply(data, { split: true });
    }
    if (args[0]) {
      const name = args[0].toLowerCase(); // 입력된 값 소문자로 반환
      const command =
        commands.get(name) ||
        commands.find((c) => c.aliases && c.aliases.includes(name));

      if (!command) {
        return message.reply(`${args} 라는 명령어를 찾지 못하였습니다!`);
      }

      data.push(`**이름:** ${command.help}`);

      if (command.aliases) data.push(`**별칭:** ${command.aliases.join(", ")}`);
      if (command.description) data.push(`**설명:** ${command.description}`);
      if (command.usage)
        data.push(`**사용법:** ${prefix}${command.name} ${command.usage}`);
      if (command.cooldown) data.push(`**쿨타임:** ${command.cooldown} 초`);

      message.reply(data, { split: true });
    }
  },
};