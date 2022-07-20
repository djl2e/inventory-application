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
var async = require('async');
var Category = require('./models/category');
var Item = require('./models/item');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = []
var items = []

const noImage = 'no-image.png';

function categoryCreate(name, img, callback) {
  const categoryDetail = { name: name };
  if (img != false) {
    categoryDetail.img = img;
  } else {
    categoryDetail.img = noImage;
  }

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
  } else {
    itemDetail.img = noImage;
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
      categoryCreate('Nike', 'nike-logo.png', callback);
    },
    function(callback) {
      categoryCreate('Air Jordan', 'jumpman-logo.png', callback);
    },
    function(callback) {
      categoryCreate('Under Armour', 'ua-logo.png', callback);
    },
    function(callback) {
      categoryCreate('Adidas', 'adidas-logo.png', callback);
    },
  ], cb);
}

function createItems(cb) {
  async.parallel([
    function(callback) {
      itemCreate('Lebron 11', categories[0], 199.00, true, 'lebron-11.png', callback);
    },
    function(callback) {
      itemCreate('Kobe 9', categories[0], 349.00, false, 'kobe-9.jpg', callback);
    },
    function(callback) {
      itemCreate('KD 6', categories[0], 129.00, true, 'kd-6.jpg', callback);
    },
    function(callback) {  
      itemCreate('Kyrie 7', categories[0], 159.00, true, 'kyrie-7.png', callback);
    },
    function(callback) {
      itemCreate('Lebron 7', categories[0], 179.00, true, 'lebron-7.jpg', callback);
    },
    function(callback) {
      itemCreate('Jordan 1', categories[1], 1199.00, false, 'jordan-1.jpg', callback);
    },
    function(callback) {
      itemCreate('Jordan 3', categories[1], 799.00, false, 'jordan-3.jpg', callback);
    },
    function(callback) {
      itemCreate('Jordan 6', categories[1], 289.00, true, 'jordan-6.jpg', callback);
    },
    function(callback) {
      itemCreate('Jordan 11', categories[1], 249.00, true, 'jordan-11.jpg', callback);
    },
    function(callback) {
      itemCreate('Curry 2', categories[2], 129.00, true, 'curry-2.jpg', callback);
    },
    function(callback) {
      itemCreate('Curry 3', categories[2], 139.00, true, 'curry-3.jpg', callback);
    },
    function(callback) {
      itemCreate('Curry 7', categories[2], 159.00, false, 'curry-7.jpg', callback);
    },
    function(callback) {
      itemCreate('Rose 2', categories[3], 119.00, true, 'rose-2.jpg', callback);
    },
    function(callback) {
      itemCreate('Harden 2', categories[3], 119.00, true, 'harden-2.jpg', callback);
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




