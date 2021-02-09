const { prefix, token, dev, DB } = require("./config.json"); // config.json 에서 접두사, 토큰, 개발자, 디비 불러오기
const knex = require("knex")({
  client: DB.client,
  connection: {
    host: DB.connection.host,
    user: DB.connection.user,
    password: DB.connection.password,
    database: DB.connection.database,
  },
}); // DB 에 연결
const Discord = require("discord.js");
const { Intents } = require("discord.js");
const client = new Discord.Client({ ws: { intents: Intents.ALL } }); // client 생성(인텐츠 모두 활성화)
client.login(token);
client.on("ready", () => {
  console.log(`${client.user.tag}is Ready`);
});
const cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();
const fs = require("fs");
client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return; // 접두사로 시작 안하거나 봇이면 return
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js")); // commands 파일에서 .js 로 끝나는 파일 불러오기
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }
  const args = message.content.slice(prefix.length).trim().split(/ +/); //args 는 접두사를 제외한 나머지
  const commandName = args.shift().toLowerCase(); // args 에서 첫번째 요소(명령어) 제거한 후 소문자로 반환
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );
  if (!command) return; // 명령어가 없다면 return
  if (command.args && !args.length) {
    // 명령어에 args 가 있어야 되는데 없다면
    let reply = `인수를 제공하지 않았습니다, ${message.author}!`;
    if (command.usage) {
      reply += `\n올바른 사용법: \`${prefix}${command.name} ${command.usage}\``; // 명령에 usage 가 있다면 메시지 전송
    }
    return message.reply(reply);
  }
  if (message.channel.type === "dm") {
    return;
  }
  // dm채널에서 명령어를 써도 되게 하려면 39~41번 줄 삭제
  if (command.guildOnly && message.channel.type === "dm") {
    // 명령어 guildOnly 가 true 이고 dm채널에서 명령어를 쓰면
    return message.reply("이 명령어는 DM 에서 사용 불가능합니다!");
  }
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000; // 명령어의 cooldown 이 쿨타임 초, 없다면 기본 3초
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `${timeLeft.toFixed(1)} 초 뒤에 \`${
          command.help
        }\` 명령어를 사용해주세요!`
      ); // 쿨타임이 지나기 전에 메시지를 쓰면 메시지 전송
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); // 쿨타임 시간이 지나면 값 삭제
  if (command.permissions) {
    const authorPerms = message.channel.permissionsFor(message.author);
    if (!authorPerms || !authorPerms.has(command.permissions)) {
      // 권한이 낮거나 부족하면 메시지 전송
      return message.reply(
        `이 명령어를 사용할 권한이 부족합니다!\n필요한 권한: ${command.permissions}`
      );
    }
  }
  if (!dev.includes(message.author.id) && command.dev) {
    // 개발자가 아니고 명령어에 dev 가 true 이면 메시지 전송
    return message.reply("이 명령어는 개발자만 가능합니다!");
  }
  try {
    command.execute(client, message, args, prefix, knex);
  } catch (error) {
    console.log(error);
  }
});
/*이벤트 핸들러 
  출처 - https://medium.com/discordbot/this-is-a-good-event-handler-for-your-first-discord-js-bot-1e338e670697
*/
fs.readdir("./event/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const eventFunction = require(`./event/${file}`);
    if (eventFunction.disabled) return;
    const event = eventFunction.event || file.split(".")[0];
    const emitter =
      (typeof eventFunction.emitter === "string"
        ? client[eventFunction.emitter]
        : eventFunction.emitter) || client;
    const once = eventFunction.once;
    try {
      emitter[once ? "once" : "on"](event, (...args) =>
        eventFunction.run(...args, knex)
      );
    } catch (error) {
      console.error(error.stack);
    }
  });
});