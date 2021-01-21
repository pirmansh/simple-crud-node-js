const express = require('express');
const authController = require('../controllers/auth.controller');
const {body} = require('express-validator/check');

const router = express.Router();

router.get('/', authController.getLoginPage);

router.post('/',
[
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 3 })
      .isAlphanumeric()
      .trim()
],
authController.prosesLogin);

router.get('/logout', authController.prosesLogout);

module.exports = router;