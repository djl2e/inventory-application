const Category = require('../models/category');
const Item = require('../models/item');

const async = require('async');
const { body, validationResult } = require('express-validator');
const { upload } = require('../multer-file');

exports.create_get = function(req, res, next) {
  res.render('category_form', { title: 'New Brand', name: '', update: false, id: '' });
};

exports.create_post = [
  upload.single('brand-form-image'),

  body('brand-form-name', 'Brand name required').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const formName = req.body['brand-form-name']   

    if (!errors.isEmpty()) {
      res.render('category_form', { title: 'New Brand', name: formName, update: false, id: '' })
      return;
    } 
    else {
      Category.findOne({ 'name': formName })
        .exec( function(err, found_category) {
          if (err) { return next(err); }

          if (found_category) {
            res.redirect('../' + found_category.url);
          } 
          else {
            let imgName = '';
            if (req.file) {
              imgName = req.file.filename;
            } else {
              imgName = 'no-image.png';
            }
            const category = new Category({ name: formName, img: imgName });
            category.save(function (err) {
              if (err) { next(err); }
              res.redirect('../' + category.url);
            })
          }
        })
    }
  }
];

exports.delete_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED');
};

exports.delete_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED');
};

exports.update_get = function(req, res, next) {
  Category.findById(req.params.id)
    .exec(function(err, results) {
      if (err) { return next(err); }
      res.render('category_form', { title: 'Update Brand', name: results.name, update: true, id: req.params.id })
    })
};

exports.update_post = [
  upload.single('brand-form-image'),

  body('brand-form-name', 'Brand name required').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const name = req.body['brand-form-name']

    if (!errors.isEmpty()) {
      res.render('category_form', { title: 'New Brand', name: name, update: false, id: req.params.id })
      return;
    } else {

      let img = ''
      if (req.file) {
        img = req.file.filename;
      } else  {
        img = Category.findById(req.params.id).img;
      }

      const category = new Category({
        name: name,
        img: img,
        _id: req.params.id,
      })

      Category.findByIdAndUpdate(req.params.id, category, {}, function(err, new_category) {
        if (err) { return next(err); }
        res.redirect('./');
      })
    }
  }
];

exports.detail = function(req, res, next) {
  async.parallel({
    category: function(callback) {
      Category.findById(req.params.id).exec(callback);
    },
    items: function(callback) {
      Item.find({ 'category': req.params.id }).exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err) }
    if (results.category == null) {
      const err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }
    res.render('category_detail', { title: 'Brand Detail', category: results.category, items: results.items })
  })
};

exports.list = function(req, res, next) {
  Category.find({})
    .exec(function(err, list_category) {
      if (err) { next(err); }
      res.render('category_list', { title: 'Brand List', category_list: list_category })
    });
};
