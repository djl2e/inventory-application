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
router.get('/brand/delete', category_controller.delete_get);

// POST delete brand
router.post('/brand/delete', category_controller.delete_post);

// GET update brand
router.get('/brand/update', category_controller.update_get)

// POST update brand
router.post('/brand/update', category_controller.update_post)

// GET create shoes
router.get('/shoes/create', item_controller.create_get);

// POST create shoes
router.post('/shoes/create', item_controller.create_post);

// GET delete shoes
router.get('/shoes/delete', item_controller.delete_get);

// POST delete shoes
router.post('/shoes/delete', item_controller.delete_post);

// GET update shoes
router.get('/shoes/update', item_controller.update_get)

// POST update shoes
router.post('/shoes/update', item_controller.update_post)

module.exports = router;
