// 서버에 유저가 들어오면
module.exports = {
  event: "guildMemberAdd",
  once: false,
  async run(member, knex) {
      const guild = (await knex("event").where({ id: member.guild.id }))[0]; // DB 불러오기
      if (
        !guild.welcomechannel ||
        !guild.welcomemessage
        ) return; // 입장채널 설정이 안되있거나 입장메시지 설정이 안되있으면 return
      const channel = member.guild.channels.cache.get(guild.welcomechannel); // 유저가 들어온 서버에서 입장 채널 불러오기
      const welcomemessage = guild.welcomemessage.replace("{유저}", member); // "{유저}" 를 들어온 유저 맨션으로 바꾸기
      const result = welcomemessage.replace("{서버}", member.guild.name); // "{서버}" 를 유저가 들어온 서버 이름으로 바꾸기
      channel.send(result.replace("{유저수}", member.guild.memberCount)); // "{유저수}" 를 유저가 들어온 서버 유저 수 바꾸기 및 메시지 전송
  }
};