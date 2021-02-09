# Team Wild 오픈소스 - support 봇

# Discord.js version 12.5.1<br>라이센스 없는 전체 무료 오픈 소스<br>Djs커맨드 핸들러, 기본 명령어, 커스텀명령어<br>

# [Discord.js 닥스](https://discord.js.org/) - https://discord.js.org/<br>[Discord.js 가이드](https://discordjs.guide/) - https://discordjs.guide/
# [Mysql 홈페이지](https://www.mysql.com/) - https://www.mysql.com/ <br> [Knex 닥스](http://knexjs.org/) - http://knexjs.org/

## **[이벤트 핸들러 참조](https://medium.com/discordbot/this-is-a-good-event-handler-for-your-first-discord-js-bot-1e338e670697) - https://medium.com/discordbot/this-is-a-good-event-handler-for-your-first-discord-js-bot-1e338e670697**
---
## 시작하기
<br>

### 1. config.json
```json
{
    "token": "봇 토큰",
    "prefix": "접두사",
    "dev": [
        "개발자, 관리자 1",
        "개발자, 관리자 2",
        "개발자, 관리자 3"
    ],
    "DB": {
        "client": "mysql",
        "connection": {
          "host": "호스트(ip)",
          "user": "root",
          "password": "sql 비밀번호",
          "database": "DB 이름"
        }
    }
}
```
### 2. setup.sql
```sql
create table event (
    id varchar(255),
    logchannel varchar(255),
    welcomechannel varchar(255),
    welcomemessage varchar(255),
    byechannel varchar(255),
    byemessage varchar(255) 
)
```

### 3. start.bat
```bat
node sharding.js
```
---
## 명령어 추가 방법 
```js
module.exports = {
	name: 'ping', // 리로드 할떄 쓸 이름
	description: '봇의 핑을 보여줍니다!', // 도움말에 나오는 설명
	help: '핑', // 도움말에 나오는 이름
    aliases: ['핑', 'ping'], // 다른 사용법
    permissions: 'ADMINISTRATOR', // ADMINISTRATOR(관리자) 권한이 있어야 사용 가능
    args: true, // 명령어 뒤에 입력해야 되는게 있음
    usage: '<user>', // 사용법
    guildOnly: true, //DM에서 명령어 사용을  막음 (index.js 에서 막았으므로 필요 없음)
    cooldown: 5, //쿨타임 5초 (없으면 3초)
	execute(client, message, args, prefix, knex) {
        message.channel.send('퐁!') // 코드
	},
};
```
---
## 버그 및 문의, 수정, 기여

### 1. 버그 
> 버그는 깃허브 issue 나 [디스코드 지원서버(Team Wild)](https://discord.gg/wuJBQaECfa)에서 문의 해주시기 바랍니다!

### 2. 문의
> 문의는 [디스코드 지원서버(Team Wild)](https://discord.gg/wuJBQaECfa)에서 문의 해주시기 바랍니다!

### 3. 수정(기여)
> 수정은 깃허브 pull request 나 [디스코드 지원서버(Team Wild)](https://discord.gg/wuJBQaECfa)에서 문의 해주시기 바랍니다!

---
# **최종수정 - 2021년 2월 8일**