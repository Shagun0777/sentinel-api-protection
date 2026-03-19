# Sentinel API Protection

A **distributed API protection system** built with **Node.js, Redis, Prometheus, and Grafana**.

Sentinel protects backend APIs from abusive clients by implementing:

- distributed rate limiting
- traffic spike detection
- IP reputation scoring
- real-time monitoring dashboards

The system detects abnormal traffic patterns and automatically blocks malicious clients while exposing observability metrics for monitoring.

---

## Key Capabilities

• Distributed Rate Limiting  
• Real-Time Traffic Monitoring  
• Attack Detection  
• Automated IP Blocking  
• Prometheus Metrics Export  
• Grafana Security Dashboard  

---

## Example Attack Flow

Sentinel uses a layered API protection architecture.

```

             Client Requests
                    │
                    ▼
           Node.js API Gateway
                    │
                    ▼
           Rate Limiting Layer
        ┌────────────┼────────────┐
        │            │            │
   Token Bucket   Sliding Window   Reputation Check
        │
        ▼
      Redis
(distributed state storage)
        │
        ▼
 Prometheus Metrics Exporter
        │
        ▼
      Prometheus
        │
        ▼
     Grafana Dashboard

```


This architecture allows Sentinel to:

- block malicious traffic
- detect spikes
- expose real-time metrics
- scale across distributed systems

---

# Tech Stack

| Component | Purpose |
|---|---|
| Node.js | API server |
| Redis | distributed rate limiting storage |
| Prometheus | metrics collection |
| Grafana | monitoring dashboard |
| Docker | containerized deployment |

---

# Project Structure

```

sentinel-api-protection
│
├── src
│ ├── config
│ │ └── rateLimits.js
│ │
│ ├── logger.js
│ ├── metrics.js
│ ├── rateLimiter.js
│ ├── redisClient.js
│ ├── reputation.js
│ ├── slidingWindow.js
│ ├── tokenBucket.js
│ └── server.js
│
├── monitoring
│ ├── prometheus
│ │ └── prometheus.yml
│ │
│ └── grafana
│ ├── dashboards
│ │ └── sentinel-dashboard.json
│ │
│ └── alerts
│ └── alerts.yaml
│
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md

```
---

# How Sentinel Stops Attacks

Sentinel uses a multi-layer defense strategy.

1️⃣ **Traffic Spike Detection**

Prometheus monitors request volume and detects sudden traffic spikes.

2️⃣ **Rate Limiting**

If a client sends too many requests within a short window, the rate limiter blocks excess traffic.

3️⃣ **Reputation System**

Repeated violations increase the client's reputation score.

When the score exceeds the threshold, the IP is automatically banned.

4️⃣ **Permanent Blocking**

Banned clients receive:

HTTP 403 Forbidden

and cannot access the API until the block expires.

# Running the Project

## 1 Clone repository

```

git clone https://github.com/YOUR_USERNAME/sentinel-api-protection.git

cd sentinel-api-protection

```

---

## 2 Start services

```

docker compose up --build

```

This launches:

- Node API
- Redis
- Prometheus
- Grafana

---

# Access Services

| Service | URL |
|---|---|
| API | http://localhost:3000 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3001 |

---

# API Endpoints

| Endpoint | Description |
|---|---|
| `/search` | Example protected endpoint |
| `/metrics` | Prometheus metrics endpoint |

---

# Attack Simulation

You can simulate high-traffic scenarios.

## Normal Traffic

```
for i in {1..100}; do curl http://localhost:3000/search ; done

```


Expected behaviour:

- requests allowed
- no blocking

---

## Attack Simulation

```
seq 2000 | xargs -P100 -I{} curl http://localhost:3000/search

```

Expected behaviour:

- rate limiter activates
- requests blocked
- metrics recorded

---

# Monitoring Dashboard

Sentinel exposes Prometheus metrics visualized using Grafana.

The dashboard tracks:

- total API requests
- blocked requests
- traffic rate
- blocked request ratio
- endpoint traffic
- spike detection

---

### Dashboard Overview

![Dashboard Overview](screenshot/dashboard-overview.jpeg)

---

# Total API Requests Panel

Prometheus query:

```

sum(increase(sentinel_requests_total[5m]))

```

Explanation:

Shows the number of API requests received in the last 5 minutes.

Screenshot:



---

# Blocked Requests Panel

Prometheus query:

```

sum(sentinel_blocked_requests_total)

```

Explanation:

Displays the number of requests blocked by the rate limiter.

Screenshot:



---

# API Traffic Rate Panel

Prometheus query:

```

sum by(route)(rate(sentinel_requests_total[1m]))

```

Explanation:

Displays requests per second per endpoint.

Screenshot:



---

# Endpoint Traffic Distribution

Prometheus query:

```

sum by(route)(increase(sentinel_requests_total[5m]))

```

Explanation:

Shows which API endpoints receive the most traffic.

Screenshot:



---

# Blocked Traffic Ratio

Prometheus query:

```

sum(increase(sentinel_blocked_requests_total[5m])) / sum(increase(sentinel_requests_total[5m]))

```

Explanation:

Displays percentage of requests blocked by Sentinel.

Screenshot:



---

# Traffic Spike Detector

Prometheus query:

```

sum(rate(sentinel_requests_total[1m])) / sum(rate(sentinel_requests_total[5m]))

```

Explanation:

Detects abnormal spikes in traffic volume.

Screenshot:



---

# Deployment

The project can be deployed using Docker on any cloud VM.

Example platforms:

- Oracle Cloud Free Tier
- AWS EC2
- Google Cloud VM
- DigitalOcean

Run:

```
docker compose up -d
```

Expose ports:

```
3000 API
3001 Grafana
9090 Prometheus
```

---

# Example Attack Monitoring

Add a screenshot showing the dashboard during a simulated attack.



---

# Metrics Exported

Prometheus metrics exposed by Sentinel:

```
sentinel_requests_total
sentinel_blocked_requests_total
sentinel_rate_limit_hits
```

---

# Future Improvements

Possible enhancements:

- distributed rate limiting across multiple API nodes
- automated threat scoring
- anomaly detection with machine learning
- alerting via Slack / PagerDuty
- integration with API gateway

---

# License

MIT License
