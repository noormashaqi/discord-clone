const { v4: uuidv4 } = require('uuid');
const db = require('./db');

db.deleteAll('channels');

db.insertMany('channels', [
  { _id: uuidv4(), name: 'general',   description: 'General chat for everyone', createdAt: new Date().toISOString() },
  { _id: uuidv4(), name: 'tech-talk', description: 'Discuss technology & code',  createdAt: new Date().toISOString() },
  { _id: uuidv4(), name: 'random',    description: 'Random stuff',               createdAt: new Date().toISOString() },
  { _id: uuidv4(), name: 'gaming',    description: 'Gaming discussions',         createdAt: new Date().toISOString() },
  { _id: uuidv4(), name: 'music',     description: 'Share your music',           createdAt: new Date().toISOString() },
]);

console.log('✅ Channels seeded!');