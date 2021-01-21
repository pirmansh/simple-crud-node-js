const express = require('express');
const adminController = require('../controllers/admin.controller');
const isAuth = require('../middleware/isAuth');
const {  check ,body } = require('express-validator');

const router = express.Router();

router.get('/dashboard', isAuth, adminController.getDashboardPage);
router.get('/profile/:id', isAuth, adminController.getProfilePage);
router.get('/profile', isAuth, adminController.getProfilePage);
router.get('/all', isAuth, adminController.getAllAdminPage);
router.get('/add', isAuth, adminController.getAddAdminPage);
router.get('/edit/:id', isAuth, adminController.getEditAdminPage);

router.post('/profile/:id',
[
  body('fullname', 'Setiap inputan wajib di isi, fullname minimal 3 karakter!')
  .isString()
  .isLength({ min: 3 })
  .trim(),
  body(
    'password',
    'Please enter a password with only numbers and text and at least 5 characters.'
  )
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim()
],adminController.editProfile);
router.post('/edit/:id', 
[
  body('fullname', 'Setiap inputan wajib di isi, fullname minimal 3 karakter!')
  .isString()
  .isLength({ min: 3 })
  .trim(),
  body('role', 'Please input role')
  .isLength({ min: 1 })
  .trim()
]
,adminController.editAdmin);
router.post('/add', 
[   
    body('fullname', 'Setiap inputan wajib di isi, fullname minimal 3 karakter!')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    check('email')
      .isEmail()
      .isLength({ min: 3 })
      .withMessage('Masukan alamat email yang valid!')
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 5 characters.'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('role', 'Please input role')
      .isLength({ min: 1 })
      .trim()
  ], adminController.addAdmin);
router.get('/reset-password/:id', isAuth, adminController.resetPasswordPage);
router.post('/reset-password/:id', 
[
  body(
    'password',
    'Please enter a password with only numbers and text and at least 5 characters.'
  )
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
], adminController.resetPassword);

router.get('/delete/:id', adminController.deleteAdmin);


module.exports = router;