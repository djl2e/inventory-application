const { body, validationResult } = require('express-validator');
const { getEmail, changeEmail } = require('../email-address');
require('dotenv').config();

exports.email_get = (req, res, next) => {
  res.render('email_form', { title: 'Email Update' });
};

exports.email_post = [
  body('email-form-name', 'Email address required').trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const email = req.body['email-form-name'];
    if (!errors.isEmpty()) {
      res.render('email_form', {
        title: 'Email Update'
      });
    }
    else {
      changeEmail(email);
      res.redirect('/');
    }
  }
];
