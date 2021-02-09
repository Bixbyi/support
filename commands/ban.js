  module.exports = {
    name: "ban",
    description: "멤버를 밴 합니다!",
    aliases: ["밴", "벤", "ban", "차단"],
    help: "밴",
    permissions: "BAN_MEMBERS",
  execute(client, message, args, prefix, knex) {
    if (!args[0])
      return message.reply("밴 할 유저를 맨션 이나 아이디를 적어주세요!");
    const user =
      !isNaN(args[0]) == false
        ? message.mentions.members.first()
        : message.guild.members.cache.get(args[0]);
    if (!user) return message.reply("정확한 유저의 아이디를 적어주세요!");
    const reason = args[1] ? args[1] : "사유 없음";
    if (!message.guild.me.hasPermission("BAN_MEMBERS"))
      return message.reply("저의 권한이 너무 낮습니다!");
    message.reply("잠시만 기다려주세요!").then(async (m) => {
      user.ban({ reason: reason }) // 유저밴
      .catch(() => {
        return m.edit("저의 권한이 너무 낮습니다!");
      });
      m.edit(`${user.user.tag} 님을 밴 하였습니다!\n사유: ${reason}`);
    });
  },
};