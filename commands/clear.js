module.exports = {
  name: "clear",
  description: "메시지를 삭제합니다!",
  aliases: ["청소", "삭제", "clear", "clean"],
  help: "청소",
  permissions: "MANAGE_MESSAGES",
  execute(client, message, args, prefix, knex) {
    const amount = args;
    var isNum = !isNaN(amount);
    if (!message.member.hasPermission(["MANAGE_MESSAGES"]))
      return message.reply("저의 권한이 너무 낮습니다!"); // 유저 권한 확인
    if (
      !amount ||
      (isNum && (amount <= 0.9 || 99.9 < amount)) ||
      isNum == false
    ) {
      message.reply(
        `${message.member}, 1 ~ 99 사이의 숫자를 입력해주세요!`
        );
        return; // 숫자가 1~99가 아니거나 숫자가 아닐시 return
    } else {
      message.channel.bulkDelete(parseInt(amount) + 1, true); // 메시지 삭제
      // .then(() => {
      //   message.channel.send(`${amount}개의 메시지를 삭제하였습니다!\n이 메시지는 3초 후에 사라집니다`).then((msg) => msg.delete({ timeout: 3000 }))
      // })
      // 깔끔하게 하려고 확인 메시지는 안보냄 / 보내려면 위에 17~19 줄 주석 삭제
    }
  },
};
