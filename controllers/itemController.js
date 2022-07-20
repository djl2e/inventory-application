const Item = require('../models/item');
const Category = require('../models/category');

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

exports.create_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED');
}

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
