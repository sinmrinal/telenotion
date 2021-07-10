import redis from 'redis';

export const publish = redis.createClient();
export const subscribe = redis.createClient();