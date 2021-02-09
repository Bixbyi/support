module.exports = {
  name: "kick",
  description: "멤버를 킥 합니다!",
  aliases: ["킥", "kick", "추방"],
  help: "킥",
  permissions: "KICK_MEMBERS",
  execute(client, message, args, prefix, knex) {
    if (!args[0])
      return message.reply("킥 할 유저를 맨션 이나 아이디를 적어주세요!");
    const user =
      !isNaN(args[0]) == false
        ? message.mentions.members.first()
        : message.guild.members.cache.get(args[0]);
    if (!user) return message.reply("정확한 유저의 아이디를 적어주세요!");
    const reason = args[1] ? args[1] : "사유 없음";
    if (!message.guild.me.hasPermission("KICK_MEMBERS"))
      return message.reply("저의 권한이 너무 낮습니다!");
    message.reply("잠시만 기다려주세요!").then(async (m) => {
      user.kick({ reason: reason }) // 유저킥
      .catch(() => {
        return m.edit("저의 권한이 너무 낮습니다!");
      });
      m.edit(`${user.user.tag} 님을 킥 하였습니다!\n사유: ${reason}`);
    });
  },
};
