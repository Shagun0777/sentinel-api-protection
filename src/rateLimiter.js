const tokenBucket = require("./tokenBucket");
const slidingWindow = require("./slidingWindow");
const rateLimits = require("./config/rateLimits");

async function rateLimiter(ip, route) {
  const config = rateLimits[route] || rateLimits["/"];

  if (config.algorithm === "sliding_window") {
    return slidingWindow(ip, route);
  }

  return tokenBucket(ip, route);
}

module.exports = rateLimiter;