module.exports = {
  "/": {
    algorithm: "token_bucket",
    capacity: 5,
    refillRate: 1
  },

  "/login": {
    algorithm: "token_bucket",
    capacity: 3,
    refillRate: 1
  },

  "/search": {
    algorithm: "sliding_window",
    limit: 10,
    window: 10000
  }
};