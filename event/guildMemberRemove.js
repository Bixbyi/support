// 서버에 유저가 나가면
module.exports = {
  event: "guildMemberRemove",
  once: false,
  async run(member, knex) {
      const guild = (await knex("event").where({ id: member.guild.id }))[0]; // DB 불러오기
      if(
        !guild.byechannel ||
        !guild.byemessage
      ) return // DB값이 없거나 퇴장채널 설정이 안되있거나 퇴장메시지 설정이 안되있으면 return
      const channel = member.guild.channels.cache.get(guild.byechannel); // 유저가 나간 서버에서 퇴장 채널 불러오기
      const byemessage = guild.byemessage.replace("{유저}", member); // "{유저}" 를 나간 유저 맨션으로 바꾸기
      const result = byemessage.replace("{서버}", member.guild.name); // "{서버}" 를 유저가 나간 서버 이름으로 바꾸기
      channel.send(result.replace("{유저수}", member.guild.memberCount)); // "{유저수}" 를 유저가 나간 서버 유저 수로 바꾸기 및 메시지 전송
    }};