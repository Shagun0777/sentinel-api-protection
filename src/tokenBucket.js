const redis = require("./redisClient");
const rateLimits = require("./config/rateLimits");

async function tokenBucket(ip, route) {
  const config = rateLimits[route] || rateLimits["/"];
  const CAPACITY = config.capacity;
  const REFILL_RATE = config.refillRate;
  // Now each route has its own bucket.
  const key = `token_bucket:${ip}:${route}`;
  const now = Date.now();

  const luaScript = `
    local key = KEYS[1]
    local capacity = tonumber(ARGV[1])
    local refill_rate = tonumber(ARGV[2])
    local now = tonumber(ARGV[3])

    local data = redis.call("HMGET", key, "tokens", "last_refill")
    local tokens = tonumber(data[1])
    local last_refill = tonumber(data[2])

    if tokens == nil then
      tokens = capacity
      last_refill = now
    end

    local elapsed = math.max(0, now - last_refill)
    local refill = math.floor(elapsed / 1000 * refill_rate)

    tokens = math.min(capacity, tokens + refill)
    last_refill = now

    if tokens > 0 then
      tokens = tokens - 1
      redis.call("HMSET", key, "tokens", tokens, "last_refill", last_refill)
      redis.call("EXPIRE", key, 60)
      return 1
    else
      redis.call("HMSET", key, "tokens", tokens, "last_refill", last_refill)
      redis.call("EXPIRE", key, 60)
      return 0
    end
  `;

  const result = await redis.eval(
    luaScript,
    1,
    key,
    CAPACITY,
    REFILL_RATE,
    now
  );

  return result === 1;
}

module.exports = tokenBucket;