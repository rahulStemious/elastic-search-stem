const { Client } = require('@elastic/elasticsearch');

const nodeUrl = process.env.ELASTIC_NODE || 'https://accc1917321444ada1dcd5afebbed358.asia-south1.gcp.elastic-cloud.com:443';
const apiKey = process.env.ELASTIC_API_KEY;

if (!apiKey) {
  throw new Error("❌ ELASTIC_API_KEY must be provided.");
}

module.exports = new Client({
  node: nodeUrl,
  auth: { apiKey },
});
