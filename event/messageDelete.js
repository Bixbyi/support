const Discord = require('discord.js')
// 메시지가 삭제되면
module.exports = {
  event: "messageDelete",
  once: false,
  async run(message, knex) {
      const guild = (
        await knex.select("*").from("event").where({ id: message.guild.id })
      )[0].logchannel; // DB에서 로그 채널 불러오기
      if (!guild || message.author.bot) return; // 로그 채널이 없거나 삭제한 유저가 봇이면 return
      const channel = message.guild.channels.cache.get(guild); // 메시지가 삭제된 서버에서 로그 채널 불러오기
      const { MessageAttachment } = require("discord.js");
      const fetch = require("node-fetch");
      if (message.attachments.array().length > 0) { // 파일
        try {
          const result = await fetch(message.attachments.array()[0].proxyURL);
          if (!result.ok) {
            const embed = new Discord.MessageEmbed();
            embed.setTitle("메시지삭제로그");
            embed.addFields(
              { name: "메시지주인", value: `${message.author}` },
              { name: "채널", value: `${message.channel}` },
              { name: "삭제내용", value: `파일` }
            ); // 파일은 캐시되지 않아서 다시 전송 X
            embed.setThumbnail(`${message.author.displayAvatarURL()}`);
            embed.setFooter( `${message.author.tag}` , message.author.displayAvatarURL() );
            embed.setTimestamp(new Date());
            embed.setColor("#93bfe6");
            return channel.send(embed);
          }
          const avatar = await result.buffer();
          const attachment = new MessageAttachment(
            avatar,
            message.attachments.array()[0].name
          ); // 사진 링크
          if (message.content.length == 0) { // 사진
            const embed = new Discord.MessageEmbed();
            embed.setTitle("메시지삭제로그");
            embed.addFields(
              { name: "메시지주인", value: `${message.author}` },
              { name: "채널", value: `${message.channel}` },
              { name: "삭제내용", value: `사진` }
            );
            embed.setThumbnail(`${message.author.displayAvatarURL()}`);
            embed.setFooter(`${message.author.tag}` , message.author.displayAvatarURL() );
            embed.setTimestamp(new Date());
            embed.setColor("#93bfe6");
            channel.send(embed);
            return channel.send(attachment);
          } else { // 메시지
            const embed = new Discord.MessageEmbed();
            embed.setTitle("메시지삭제로그");
            embed.addFields(
              { name: "메시지주인", value: `${message.author}` },
              { name: "채널", value: `${message.channel}` },
              { name: "삭제내용", value: `${message.content}` } 
            )
            embed.setThumbnail(`${message.author.displayAvatarURL()}`);
            embed.setFooter( `${message.author.tag}` , message.author.displayAvatarURL() );
            embed.setTimestamp(new Date());
            embed.setColor("#93bfe6");
            return channel.send(embed);
          }
        } catch (e) {
         
          return console.log(e);
        }
      }
      //메시지
      const embed = new Discord.MessageEmbed(); 
      embed.setTitle("메시지삭제로그");
      embed.addFields(
        { name: "메시지주인", value: `${message.author}` },
        { name: "채널", value: `${message.channel}` },
        { name: "삭제내용", value: `${message.content}` }
      );
      embed.setThumbnail(`${message.author.displayAvatarURL()}`);
      embed.setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
      embed.setTimestamp(new Date());
      embed.setColor("#93bfe6");
      return channel
        .send(embed)
        .catch(() => {
          // 삭제된 메시지가 1024(임베드 필드 최대 길이)가 넘으면
          const embed = new Discord.MessageEmbed();
          embed.setTitle("메시지삭제로그");
          embed.addFields(
            { name: "메시지주인", value: `${message.author}` },
            { name: "채널", value: `${message.channel}` },
            { name: "삭제내용", value: `메시지가 너무 길어 불러오지 못하였습니다!` }
          );
          embed.setThumbnail(`${message.author.displayAvatarURL()}`);
          embed.setFooter(
            `${message.author.tag}`,
            message.author.displayAvatarURL()
          );
          embed.setTimestamp(new Date());
          embed.setColor("#93bfe6");
          return channel.send(embed);
        });
      }}