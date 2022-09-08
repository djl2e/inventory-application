const async = require('async');
const { body, validationResult } = require('express-validator');
const Category = require('../models/category');
const Item = require('../models/item');

const s3Upload = require('../aws-image/s3-upload');
const s3Remove = require('../aws-image/s3-remove');

exports.create_get = function (req, res, next) {
  res.render('category_form', {
    title: 'New Brand', name: '', update: false, id: ''
  });
};

exports.create_post = [
  body('brand-form-name', 'Brand name required').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const formName = req.body['brand-form-name'];

    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'New Brand', name: formName, update: false, id: ''
      });
    }

    else {
      Category.findOne({ name: formName })
        .exec(async (err, found_category) => {
          if (err) {
            return next(err);
          }

          if (found_category) {
            res.redirect(`../${found_category.url}`);
          }
          else {
            let imgName = 'no-image.png';
            const file = req.files['brand-form-image'] ? req.files['brand-form-image'][0] : null;

            if (file) {
              const date = Date.now();
              imgName = date + file.originalname;
              const newFile = await s3Upload.sharpify(file, 300, 300);
              await s3Upload.upload_image(newFile, imgName);
            }

            const category = new Category({ name: formName, img: imgName });
            category.save((err) => {
              if (err) {
                next(err);
              }
              res.redirect(`../${category.url}`);
            });
          }
        });
    }
  }
];

exports.delete_get = function (req, res, next) {
  Category.findById(req.params.id)
    .exec((err, results) => {
      if (err) {
        return next(err);
      }
      res.render('delete_confirmation', {
        title: 'Delete Brand', name: results.name, is_brand: true, id: req.params.id
      });
    });
};

exports.delete_post = async function (req, res, next) {
  Category.findByIdAndRemove(req.params.id, async (err, category) => {
    if (err) {
      return next(err);
    }
    if (category.img !== 'no-image.png') {
      await s3Remove.delete_image(category.img);
    }
    res.redirect('/brand');
  });
};

exports.update_get = function (req, res, next) {
  Category.findById(req.params.id)
    .exec((err, results) => {
      if (err) {
        return next(err);
      }
      res.render('category_form', {
        title: 'Update Brand', name: results.name, update: true, id: req.params.id
      });
    });
};

exports.update_post = [

  body('brand-form-name', 'Brand name required').trim().isLength({ min: 1 }).escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    const name = req.body['brand-form-name'];

    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'New Brand', name, update: false, id: req.params.id
      });
    }
    else {
      let imgName = 'no-image.png';
      const file = req.files['brand-form-image'] ? req.files['brand-form-image'][0] : null;

      if (file) {
        const date = Date.now();
        imgName = date + file.originalname;
        const newFile = await s3Upload.sharpify(file, 400, 1000);
        await s3Upload.upload_image(newFile, imgName);
      }

      const category = new Category({
        name,
        img: imgName,
        _id: req.params.id
      });

      Category.findByIdAndUpdate(req.params.id, category, {}, async (err, old_category) => {
        if (err) {
          return next(err);
        }
        if (old_category.img !== 'no-image.png') {
          await s3Remove.delete_image(old_category.img);
        }
        res.redirect('./');
      });
    }
  }
];

exports.detail = function (req, res, next) {
  async.parallel({
    category(callback) {
      Category.findById(req.params.id).exec(callback);
    },
    items(callback) {
      Item.find({ category: req.params.id })
        .sort({ stock: -1 })
        .exec(callback);
    }
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    if (results.category == null) {
      const err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }
    res.render('category_detail', { title: 'Brand Detail', category: results.category, items: results.items });
  });
};

exports.list = function (req, res, next) {
  Category.find({})
    .exec((err, list_category) => {
      if (err) {
        next(err);
      }
      res.render('category_list', { title: 'Brand List', category_list: list_category });
    });
};
