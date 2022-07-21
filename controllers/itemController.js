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
      res.render('item_form', { 
        title: 'New Shoes', 
        categories: result,
        name: '',
        og_category: null,
        price: null,
        stock: null,
        update: false,
      })
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
            og_category: brand,
            price: price,
            stock: stock,
            update: false,
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
  Item.findById(req.params.id)
    .exec(function(err, results){
      if (err) { return next(err); }
      res.render('delete_confirmation', { title: 'Delete Item', name: results.name, is_brand: false, id: req.params.id });
    })
}

exports.delete_post = function(req, res, next) {
  Item.findByIdAndRemove(req.params.id, function(err) {
    if (err) { return next(err); }
    res.redirect('/shoes/')
  })
}

exports.update_get = function(req, res, next) {
  async.parallel({
    item_found: function(callback) {
      Item.findById(req.params.id).populate('category').exec(callback);
    },
    categories_found: function(callback) {
      Category.find({}).exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err); }
    const item = results.item_found;
    const categories = results.categories_found;

    if (item==null) { // No results.
      var err = new Error('Book not found');
      err.status = 404;
      return next(err);
    }

    res.render('item_form', { 
      title: 'Update Shoes', 
      categories: categories,
      name: item.name,
      og_category: item.category,
      price: item.price,
      stock: item.stock,
      update: true,
    })
    
  })

}

exports.update_post = [
  upload.single('shoes-form-image'),

  body('shoes-form-name', 'Shoes name required').trim().isLength({ min: 1 }).escape(),
  body('shoes-form-price', 'Price muse be a number').isNumeric(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty) {
      async.parallel({item_found: function(callback) {
        Item.findById(req.params.id).populate('category').exec(callback);
      },
      categories_found: function(callback) {
        Category.find({}).exec(callback);
      }}, 
      function(err, results) {
        if (err) { return next(err); }
        const item = results.item_found;
        const categories = results.categories_found;
        res.render('item_form', { 
          title: 'Update Shoes', 
          categories: categories,
          name: item.name,
          og_category: item.category,
          price: item.price,
          stock: item.stock,
          update: true,
        })
        return;
      })
    }
    Category.findOne({'name': req.body['shoes-form-brand']})
      .exec(function(err, result) {
        if (err) { next(err); }
        let img = '';
        if (req.file) {
          img = req.file.filename;
        } else {
          img = Item.findById(req.params.id).img;
        }
        const shoes = new Item({
          name: req.body['shoes-form-name'],
          category: result,
          price: req.body['shoes-form-price'],
          stock: req.body['shoes-form-stock'],
          img: img,
          _id: req.params.id,
        });
        Item.findByIdAndUpdate(req.params.id, shoes, {}, function(err, new_item){
          if (err) { return next(err); }
          res.redirect('./');
        });
      })
  }
]

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
      res.render('item_detail', { title: 'Shoe Detail', item: result })
    })
}

exports.list = function(req, res, next) {
  Item.find({})
    .exec(function(err, list_items) {
      if (err) { return next(err); }
      res.render('item_list', { title: 'Shoe List', item_list: list_items });
    })
}
