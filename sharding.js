const { ShardingManager } = require('discord.js') // 모듈 불러오기
const manager = new ShardingManager('./index.js', { token: require('./config.json').token, totalShards: 2 }) // 메인파일이 index.js 고 토큰은 config.json 에서 불러오고 토탈샤드(총 샤드)는 2개

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`)) // 샤드 생성
manager.spawn() //샤드 스폰