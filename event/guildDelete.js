// 서버에 유저가 들어오면
module.exports = {
    event: "guildDelete",
    once: false,
    async run(guild, knex) {
        await knex("event").del().where({ id: guild.id }); // DB 불러오기
    }
  };