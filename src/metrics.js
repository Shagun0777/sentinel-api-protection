const client = require("prom-client");

const requestCounter = new client.Counter({
  name: "sentinel_requests_total",
  help: "Total API requests",
  labelNames: ["route"]
});

const blockedCounter = new client.Counter({
  name: "sentinel_blocked_requests_total",
  help: "Total blocked requests",
  labelNames: ["route"]
});

module.exports = {
  client,
  requestCounter,
  blockedCounter
};