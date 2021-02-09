const Discord = require('discord.js')
// 메시지가 수정되면
module.exports = {
  event: "messageUpdate",
  once: false,
 async run(message, oldMessage, knex) {
            if(  
                message.author.bot ||
                oldMessage.content == message.content
              ) return // 봇이고 수정 전과 후가 같으면(gif, 이미지 방지) return
          const guild = (
            await knex("event").where({ id: message.guild.id })
          )[0].logchannel; // DB 에서 로그 채널 불러오기
          if (!guild) return; // 로그채널이 설정되어있지 않으면 return
          const channel = message.guild.channels.cache.get(guild); // 서버에서 로그 채널 불러오기
          const embed = new Discord.MessageEmbed();
          embed.setTitle("메시지수정로그");
          embed.addFields(
            { name: "메시지주인", value: `${message.author}` },
            { name: "채널", value: `${message.channel}` },
            { name: "메시지바로가기", value: `[클릭](${message.url})` },
            { name: "변경전", value: `${message.content}` },
            { name: "변경후", value: `${oldMessage}` }
          );
          embed.setThumbnail(`${message.author.displayAvatarURL()}`);
          embed.setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
          embed.setTimestamp(new Date());
          embed.setColor("#93bfe6");
          channel.send(embed)
            .catch(() => {
              // 메시지가 1024글자보다 넘을때 (임베드 필드 최대 값)
              const embed = new Discord.MessageEmbed();
              embed.setTitle("메시지삭제로그");
              embed.addFields(
                { name: "메시지주인", value: `${message.author}` },
                { name: "채널", value: `${message.channel}` },
                { name: "메시지바로가기", value: `[클릭](${message.url})` },
                { name: "삭제내용", value: `메시지가 너무 길어 불러오지 못하였습니다!` }
              );
              embed.setThumbnail(`${message.author.displayAvatarURL()}`);
              embed.setFooter( `${message.author.tag}` , message.author.displayAvatarURL() );
              embed.setTimestamp(new Date());
              embed.setColor("#93bfe6");
              return channel.send(embed);
            });
          }}