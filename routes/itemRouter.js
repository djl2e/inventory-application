const express = require('express');

const router = express.Router();
const multer = require('multer');
const itemController = require('../controllers/itemController');

// GET create shoes
router.get('/create', itemController.create_get);

// POST create shoes
router.post('/create', multer().fields([{ name: 'shoes-form-image' }]), itemController.create_post);

// GET delete shoes
router.get('/:id/delete', itemController.delete_get);

// POST delete shoes
router.post('/:id/delete', itemController.delete_post);

// POST sell shoes
router.post('/:id/sell', itemController.sell_post);

// GET update shoes
router.get('/:id/update', itemController.update_get);

// POST update shoes
router.post('/:id/update', multer().fields([{ name: 'shoes-form-image' }]), itemController.update_post);

// GET one pair of shoes
router.get('/:id', itemController.detail);

// GET all shoes
router.get('/', itemController.list);

module.exports = router;
