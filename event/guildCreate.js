// 서버에 유저가 들어오면
module.exports = {
    event: "guildCreate",
    once: false,
    async run(guild, knex) {
        await knex("event").insert({ id: guild.id }); // DB에 길드(서버) 아이디 넣기
    }
  };