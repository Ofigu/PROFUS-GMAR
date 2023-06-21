const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://alon12c20:7qWTYXSZGTIi7IBG@alonvizniuk.ecefh5m.mongodb.net/'; // Update with your MongoDB connection string
const client = new MongoClient(uri);

let db;

async function connect() {
  try {
    await client.connect();
    db = client.db('Users'); // Replace with your database name
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
}

function getDB() {
  return db;
}

module.exports = {
  connect,
  getDB,
};
