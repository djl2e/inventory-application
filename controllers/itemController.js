const Item = require('../models/item');
const Category = require('../models/category');

const async = require('async');
const { body, validationResult } = require('express-validator');
const { upload } = require('../multer-file');

exports.index = function(req, res, next) {
  res.render('index', { title: 'Shoes Locker' })
}

exports.create_get = function(req, res, next) {
  Category.find({})
    .exec(function(err, result) {
      if (err) { return next(err); }
      if (result == null) {
        const err = new Error('No Brand Added');
        err.status = 404;
        return next(err);
      }
      res.render('item_form', { title: 'New Shoes', categories: result })
    })
}

exports.create_post = [
  upload.single('shoes-form-image'),

  body('shoes-form-name', 'Shoes name required').trim().isLength({ min: 1 }).escape(),
  body('shoes-form-price', 'Price muse be a number').isNumeric(),

  (req, res, next) => {
    const errors = validationResult(req);
    const name = req.body['shoes-form-name'];
    const brand = req.body['shoes-form-brand'];
    const price = req.body['shoes-form-price'];
    const stock = req.body['shoes-form-stock'];
    
    if (!errors.isEmpty()) {
      Category.find({})
        .exec(function(err, result) {
          if (err) { return next(err); }
          if (result == null) {
            const err = new Error('No Brand Added');
            err.status = 404;
            return next(err);
          }
          res.render('item_form', { 
            title: 'New Shoes', 
            categories: result, 
            name: name, 
            brand: brand,
            price: price,
            stock: stock,
          });
          return;
        })
    }
  
    else {
      async.parallel({
        found_category: function(callback) {
          Category.findOne({ 'name' : brand }).exec(callback);
        },
        found_item: function(callback) {
          Item.findOne({ 'name': name }).exec(callback);
        }
      }, function(err, results) {
        if (err) { return next(err); }
        if (results.found_item) {
          res.redirect('../' + found_item.url);
        }
        else {
          let img = 'no-image.png';
          if (req.file) {
            img = req.file.filename;
          }

          const item = new Item({ 
            name : name, 
            category: results.found_category,
            price: price,
            stock: stock,
            img: img,
          });
          item.save(function(err) {
            if (err) { next(err); }
            res.redirect('../' + item.url);
          })
        }
      })
    }
  }
];

exports.delete_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED');
}

exports.delete_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED');
}

exports.update_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED');
}

exports.update_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED');
}

exports.detail = function(req, res, next) {
  Item.findById(req.params.id)
    .populate('category')
    .exec(function(err, result) {
      if (err) { return next(err); }
      if (result == null) {
        const err = new Error('Item not found');
        err.status = 404;
        return next(err);
      }
      res.render('item_detail', { title: 'Item Detail', item: result })
    })
}

exports.list = function(req, res, next) {
  Item.find({})
    .exec(function(err, list_items) {
      if (err) { return next(err); }
      res.render('item_list', { title: 'Item List', item_list: list_items });
    })
}
