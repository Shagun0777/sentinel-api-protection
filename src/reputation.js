const redis = require("./redisClient");

const BLOCK_THRESHOLD = 20;   // violations before block
const BLOCK_DURATION = 3600;  // block for 1 hour

async function increaseViolation(ip) {

  const key = `reputation:${ip}`;

  const score = await redis.incr(key);

  // expire score after 1 hour so it decays automatically
  await redis.expire(key, 3600);

  if (score >= BLOCK_THRESHOLD) {

    await redis.set(`blocked:${ip}`, "true", "EX", BLOCK_DURATION);

    return true;
  }

  return false;
}

async function isBlocked(ip) {

  const blocked = await redis.get(`blocked:${ip}`);

  return blocked === "true";
}

module.exports = {
  increaseViolation,
  isBlocked
};