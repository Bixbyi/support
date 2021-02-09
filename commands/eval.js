module.exports = {
  name: "eval",
  description: "실행",
  aliases: ["실행", "eval"],
  help: "실행",
  dev: true,
  async execute(client, message, args, prefix, knex) {
    const { inspect } = require("util");
    const Discord = require("discord.js");
    const arg = message.content
      .replace(prefix, "")
      .split(" ")
      .slice(1)
      .join(" ");
    if (arg.includes("client.token") || arg.includes("process.exit"))
      return message.reply("``Inaccess ible motion``"); //토큰 및 봇 끄기 방지
    try {
      const evaled = inspect(eval(arg), { depth: 0 }); // 값 계산
      const embed = new Discord.MessageEmbed();
      embed.setTitle("실행");
      embed.addField(`input`, `\`\`\`js\n${arg}\`\`\``);
      embed.addField(`output`, `\`\`\`js\n${evaled}\`\`\``);
      embed.addField(`Type of`, `\`\`\`${typeof evaled}\`\`\``);
      message.channel.send(embed);
    } catch (error) {
      const embed = new Discord.MessageEmbed();
      embed.setTitle(`실행 에러`);
      embed.addField(`error`, `${error}`);
      message.channel.send(embed);
    }
  },
};