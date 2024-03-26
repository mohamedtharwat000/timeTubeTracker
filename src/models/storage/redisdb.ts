import { createClient, RedisClientType } from 'redis';
import { log } from 'hlputils';

const redisClient: RedisClientType = createClient();

redisClient
  .on('connect', () => log('Connected to Redis.'))
  .on('error', (err) => log(`Redis Client Error: ${err}`))
  .connect();

export default redisClient;
