const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

function getFilePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

function readCollection(collection) {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf8');
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

function writeCollection(collection, data) {
  fs.writeFileSync(getFilePath(collection), JSON.stringify(data, null, 2), 'utf8');
}

function findAll(collection) {
  return readCollection(collection);
}

function findOne(collection, predicate) {
  return readCollection(collection).find(predicate) || null;
}

function findMany(collection, predicate) {
  return readCollection(collection).filter(predicate);
}

function insertOne(collection, doc) {
  const data = readCollection(collection);
  data.push(doc);
  writeCollection(collection, data);
  return doc;
}

function insertMany(collection, docs) {
  const data = readCollection(collection);
  docs.forEach(d => data.push(d));
  writeCollection(collection, data);
  return docs;
}

function deleteAll(collection) {
  writeCollection(collection, []);
}

module.exports = { findAll, findOne, findMany, insertOne, insertMany, deleteAll };