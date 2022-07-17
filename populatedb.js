#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Category = require('./models/category')
var Item = require('./models/item')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = []
var items = []

function categoryCreate(name, callback) {
  const categoryDetail = { name: name };

  const category = new Category(categoryDetail);
  category.save(function(err) {
    if (err) {
      callback(err, null);
      return
    }
    console.log('New Category: ' + category);
    categories.push(category);
    callback(null, category);
  });
}

function itemCreate(name, category, price, stock, img, callback) {
  const itemDetail = { name: name, category: category, price: price, stock: stock }
  if (img != false) {
    itemDetail.img = img;
  }
  const item = new Item(itemDetail);
  item.save(function(err) {
    if (err) {
      callback(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item);
    callback(null, item);
  })
}

function createCategories(cb) {
  async.parallel([
    function(callback) {
      categoryCreate('Nike', callback);
    }
  ], cb);
}

function createItems(cb) {
  async.parallel([
    function(callback) {
      itemCreate('Lebron XI', categories[0], 199.00, true, 'https://www.flickr.com/photos/danielygo/11595756346', callback);
    }
  ], cb);
}


async.series([
    createCategories,
    createItems,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('items: '+ items);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




