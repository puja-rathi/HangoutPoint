const express = require('express');
const app = express();
const port = 3000;

const client = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Sample custom metric (optional)
const counter = new client.Counter({
  name: 'app_request_count',
  help: 'Total number of requests',
});
register.registerMetric(counter);

// Middleware to count all requests
app.use((req, res, next) => {
  counter.inc();
  next();
});

// Main route
app.get('/', (req, res) => {
  res.send('Hello from HangoutPoint!');
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
