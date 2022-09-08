const express = require('express');

const router = express.Router();
const multer = require('multer');
const categoryController = require('../controllers/categoryController');

// GET create brand
router.get('/create', categoryController.create_get);

// POST create brand
router.post('/create', multer().fields([{ name: 'brand-form-image' }]), categoryController.create_post);

// GET delete brand
router.get('/:id/delete', categoryController.delete_get);

// POST delete brand
router.post('/:id/delete', categoryController.delete_post);

// GET update brand
router.get('/:id/update', categoryController.update_get);

// POST update brand
router.post('/:id/update', multer().fields([{ name: 'brand-form-image' }]), categoryController.update_post);

// GET one brand
router.get('/:id', categoryController.detail);

// GET all brands
router.get('/', categoryController.list);

module.exports = router;
