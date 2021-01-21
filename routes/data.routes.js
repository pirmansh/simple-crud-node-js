const express = require('express');
const dataController = require('../controllers/data.controller');
const {body} = require('express-validator/check');

const router = express.Router();

router.get('/all', dataController.getAllData);
router.get('/add', dataController.getAddDataPage);
router.get('/edit/:id', dataController.getEditDataPage);
router.get('/delete/:id', dataController.delete);

router.post('/add', 
[   
    body('no_internet', 'Setiap inputan wajib di isi!')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('sn')
      .isLength({ min: 3 })
      .withMessage('Setiap inputan wajib di isi!')
      .trim(),
    body('status', 'Setiap inputan wajib di isi!')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('alamat')
      .isLength({ min: 3 })
      .withMessage('Setiap inputan wajib di isi!')
      .trim(),
    body('keterangan')
      .isLength({ min: 3 })
      .withMessage('Setiap inputan wajib di isi!')
      .trim(),
],dataController.addAdmin);

router.post('/edit/:id', 
[   
    body('no_internet', 'Setiap inputan wajib di isi!')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('sn')
      .isLength({ min: 3 })
      .withMessage('Setiap inputan wajib di isi!')
      .trim(),
    body('status', 'Setiap inputan wajib di isi!')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('alamat')
      .isLength({ min: 3 })
      .withMessage('Setiap inputan wajib di isi!')
      .trim(),
    body('keterangan')
      .isLength({ min: 3 })
      .withMessage('Setiap inputan wajib di isi!')
      .trim(),
],dataController.editData);


module.exports = router;