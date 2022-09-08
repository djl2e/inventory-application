const async = require('async');
const nodeMailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const Item = require('../models/item');
const Category = require('../models/category');
const { getEmail } = require('../email-address');
require('dotenv').config();

const s3Upload = require('../aws-image/s3-upload');
const s3Remove = require('../aws-image/s3-remove');

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.create_get = function (req, res, next) {
  Category.find({})
    .exec((err, result) => {
      if (err) {
        return next(err);
      }
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
        stock: 0,
        update: false
      });
    });
};

exports.create_post = [
  body('shoes-form-name', 'Shoes name required').trim().isLength({ min: 1 }).escape(),
  body('shoes-form-price', 'Price must be a number').isNumeric(),
  body('shoes-form-stock', 'In stock quantity must be a number').isNumeric(),

  (req, res, next) => {
    const errors = validationResult(req);
    const name = req.body['shoes-form-name'];
    const brand = req.body['shoes-form-brand'];
    const price = req.body['shoes-form-price'];
    const stock = req.body['shoes-form-stock'];

    if (!errors.isEmpty()) {
      Category.find({})
        .exec((err, result) => {
          if (err) {
            return next(err);
          }
          if (result == null) {
            const err = new Error('No Brand Added');
            err.status = 404;
            return next(err);
          }
          res.render('item_form', {
            title: 'New Shoes',
            categories: result,
            name,
            og_category: brand,
            price,
            stock,
            update: false
          });
        });
    }

    else {
      async.parallel({
        found_category(callback) {
          Category.findOne({ name: brand }).exec(callback);
        },
        found_item(callback) {
          Item.findOne({ name }).exec(callback);
        }
      }, async (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.found_item) {
          res.redirect(`../${found_item.url}`);
        }
        else {
          let imgName = 'no-image.png';
          const file = req.files['shoes-form-image'] ? req.files['shoes-form-image'][0] : null;

          if (file) {
            const date = Date.now();
            imgName = date + file.originalname;
            const newFile = await s3Upload.sharpify(file, 600, 1000);
            await s3Upload.upload_image(newFile, imgName);
          }

          const item = new Item({
            name,
            category: results.found_category,
            price,
            stock,
            img: imgName
          });
          item.save((err) => {
            if (err) {
              next(err);
            }
            res.redirect(`../${item.url}`);
          });
        }
      });
    }
  }
];

exports.delete_get = function (req, res, next) {
  Item.findById(req.params.id)
    .exec((err, results) => {
      if (err) {
        return next(err);
      }
      res.render('delete_confirmation', {
        title: 'Delete Item', name: results.name, is_brand: false, id: req.params.id
      });
    });
};

exports.delete_post = function (req, res, next) {
  Item.findByIdAndRemove(req.params.id, async (err, old_item) => {
    if (err) {
      return next(err);
    }
    if (old_item.img !== 'no-image.png') {
      await s3Remove.delete_image(old_item.img);
    }
    res.redirect('/shoes/');
  });
};

exports.stock_post = function (req, res, next) {
  Item.findById(req.params.id, (err, item) => {
    if (err) {
      return next(err);
    }

    item.stock += 1;

    Item.findByIdAndUpdate(req.params.id, item, {}, (err, item) => {
      if (err) {
        return next(err);
      }
      res.redirect(`/${item.url}`);
    });
  });
};

exports.sell_post = function (req, res, next) {
  Item.findById(req.params.id, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item.stock === 0) {
      const err = new Error('Sold out already');
      err.status = 404;
      return next(err);
    }

    item.stock -= 1;

    if (item.stock === 0 && getEmail() !== '') {
      const mailOptions = {
        from: process.env.EMAIL,
        to: getEmail(),
        subject: `${item.name} out of stock!`,
        text: `${item.name} is out of stock. Please re-stock.`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        }
        console.log(info);
      });
    }
    Item.findByIdAndUpdate(req.params.id, item, {}, (err, item) => {
      if (err) {
        return next(err);
      }
      res.redirect(`/${item.url}`);
    });
  });
};

exports.update_get = function (req, res, next) {
  async.parallel({
    item_found(callback) {
      Item.findById(req.params.id).populate('category').exec(callback);
    },
    categories_found(callback) {
      Category.find({}).exec(callback);
    }
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    const item = results.item_found;
    const categories = results.categories_found;

    if (item == null) { // No results.
      var err = new Error('Book not found');
      err.status = 404;
      return next(err);
    }

    res.render('item_form', {
      title: 'Update Shoes',
      categories,
      name: item.name,
      og_category: item.category,
      price: item.price,
      stock: item.stock,
      update: true
    });
  });
};

exports.update_post = [
  body('shoes-form-name', 'Shoes name required').trim().isLength({ min: 1 }).escape(),
  body('shoes-form-price', 'Price muse be a number').isNumeric(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty) {
      async.parallel(
        {
          item_found(callback) {
            Item.findById(req.params.id).populate('category').exec(callback);
          },
          categories_found(callback) {
            Category.find({}).exec(callback);
          }
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          const item = results.item_found;
          const categories = results.categories_found;
          res.render('item_form', {
            title: 'Update Shoes',
            categories,
            name: item.name,
            og_category: item.category,
            price: item.price,
            stock: item.stock,
            update: true
          });
        }
      );
    }
    Category.findOne({ name: req.body['shoes-form-brand'] })
      .exec(async (err, result) => {
        if (err) {
          next(err);
        }

        const shoes = new Item({
          name: req.body['shoes-form-name'],
          category: result,
          price: req.body['shoes-form-price'],
          stock: req.body['shoes-form-stock'],
          _id: req.params.id
        });

        if (shoes.stock === 0 && getEmail() !== '') {
          const mailOptions = {
            from: process.env.EMAIL,
            to: getEmail(),
            subject: `${shoes.name} out of stock!`,
            text: `${shoes.name} is out of stock. Please re-stock.`
          };
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            }
            console.log(info);
          });
        }

        const file = req.files['shoes-form-image'] ? req.files['shoes-form-image'][0] : null;

        if (file) {
          const date = Date.now();
          const imgName = date + file.originalname;
          const newFile = await s3Upload.sharpify(file, 400, 1000);
          await s3Upload.upload_image(newFile, imgName);
          shoes.img = imgName;
        }

        Item.findByIdAndUpdate(req.params.id, shoes, {}, async (err, old_item) => {
          if (err) {
            return next(err);
          }
          if (file && old_item.img !== 'no-image.png') {
            await s3Remove.delete_image(old_item.img);
          }
          res.redirect('./');
        });
      });
  }
];

exports.detail = function (req, res, next) {
  Item.findById(req.params.id)
    .populate('category')
    .exec((err, result) => {
      if (err) {
        return next(err);
      }
      if (result == null) {
        const err = new Error('Item not found');
        err.status = 404;
        return next(err);
      }
      res.render('item_detail', { title: 'Shoe Detail', item: result });
    });
};

exports.list = function (req, res, next) {
  Item.find({})
    .sort({ stock: 'descending' })
    .exec((err, list_items) => {
      if (err) {
        return next(err);
      }
      res.render('item_list', { title: 'Shoe List', item_list: list_items });
    });
};
