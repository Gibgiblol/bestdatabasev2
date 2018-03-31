const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var express = require('express');
var parser = require('body-parser');
 
// Connection URL
const url = 'mongodb://charles:charles123@ds231199.mlab.com:31199/bestdatabasev2';
 
// Database Name
const dbName = 'bestdatabasev2';
 
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
 
  const db = client.db(dbName);
   
  client.close();
});

const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
    
    
}