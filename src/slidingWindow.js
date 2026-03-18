const redis = require("./redisClient");
const rateLimits = require("./config/rateLimits");

async function slidingWindow(ip, route) {
  const config = rateLimits[route] || rateLimits["/"];

  const LIMIT = config.limit || 5;
  const WINDOW = config.window || 10000; // milliseconds

  const key = `sliding:${ip}:${route}`;
  const now = Date.now();

  const pipeline = redis.pipeline();

  // add current request timestamp
  pipeline.zadd(key, now, `${now}-${Math.random()}`);

  // remove timestamps outside the window
  pipeline.zremrangebyscore(key, 0, now - WINDOW);

  // count remaining requests
  pipeline.zcard(key);

  // set TTL so redis auto cleans
  pipeline.expire(key, Math.ceil(WINDOW / 1000));

  const results = await pipeline.exec();

  const count = results[2][1];

  return count <= LIMIT;
}

module.exports = slidingWindow;