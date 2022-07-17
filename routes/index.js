var express = require('express');
var router = express.Router();

const category_controller = require('../controllers/categoryController');
const item_controller = require('../controllers/itemController');

/* GET home page. */
router.get('/', item_controller.index);

// GET create brand
router.get('/brand/create', category_controller.create_get);

// POST create brand
router.post('/brand/create', category_controller.create_post);

// GET delete brand
router.get('/brand/:id/delete', category_controller.delete_get);

// POST delete brand
router.post('/brand/:id/delete', category_controller.delete_post);

// GET update brand
router.get('/brand/:id/update', category_controller.update_get);

// POST update brand
router.post('/brand/:id/update', category_controller.update_post);

// GET one brand
router.get('/brand/:id', category_controller.detail);

// GET all brands
router.get('/brands', category_controller.list);

// GET create shoes
router.get('/shoes/create', item_controller.create_get);

// POST create shoes
router.post('/shoes/create', item_controller.create_post);

// GET delete shoes
router.get('/shoes/:id/delete', item_controller.delete_get);

// POST delete shoes
router.post('/shoes/:id/delete', item_controller.delete_post);

// GET update shoes
router.get('/shoes/:id/update', item_controller.update_get);

// POST update shoes
router.post('/shoes/:id/update', item_controller.update_post);

// GET one pair of shoes
router.get('/shoes/:id', item_controller.detail);

// GET all shoes
router.get('/shoes', item_controller.list);

module.exports = router;
