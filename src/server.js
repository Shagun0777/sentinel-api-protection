
const reputation = require("./reputation");
const rateLimiter = require("./rateLimiter");
const redis = require("./redisClient");
const express = require("express");
const logger = require("./logger");
const app = express();
const metrics = require("./metrics");

const PORT = process.env.PORT || 3000;

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", metrics.client.register.contentType);
  res.end(await metrics.client.register.metrics());
});

app.use((req, res, next) => {

  logger.info({
    ip: req.ip,
    route: req.path,
    method: req.method
  }, "Incoming request");

  next();

});


app.use(async (req, res, next) => {

  // Completely bypass monitoring endpoint
  if (req.path === "/metrics") {
    return next();
  }

  metrics.requestCounter.inc({ route: req.path });

  const ip = req.ip;
  const route = req.path;

  const blocked = await reputation.isBlocked(ip);

  if (blocked) {
    logger.warn({ ip, route }, "Blocked IP attempted request");

    metrics.blockedCounter.inc({ route: req.path });

    return res.status(403).json({
      error: "IP temporarily blocked 🚫"
    });
  }

  const allowed = await rateLimiter(ip, route);

  if (!allowed) {

    logger.warn({ ip, route }, "Rate limit exceeded");

    metrics.blockedCounter.inc({ route: req.path });

    const banned = await reputation.increaseViolation(ip);

    if (banned) {
      logger.error({ ip }, "IP banned due to repeated violations");

      return res.status(403).json({
        error: "Too many violations. IP blocked 🚫"
      });
    }

    return res.status(429).json({
      error: "Rate limit exceeded 🚫"
    });
  }

  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "Home route",
    serverPort: PORT
  });
});

app.get("/login", (req, res) => {
  res.json({
    message: "Login route",
    serverPort: PORT
  });
});

app.get("/search", (req, res) => {
  res.json({
    message: "Search route",
    serverPort: PORT
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});