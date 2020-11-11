// Module qui gère la création et la connéction du client
const {Client} = require('pg');

const client = new Client(process.env.PG_URL);

client.connect();

module.exports = client;