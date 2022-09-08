const express = require('express');

const router = express.Router();
const emailController = require('../controllers/emailController');

// GET new email address
router.get('/', emailController.email_get);

// POST new email address
router.post('/', emailController.email_post);

module.exports = router;
