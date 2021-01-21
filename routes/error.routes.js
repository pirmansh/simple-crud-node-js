const express = require('express');
const errorController = require('../controllers/error.controller');

const router = express.Router();

router.get('/500', errorController.get500);

router.use(errorController.get404);

router.use((error, req, res, next) => {
    // res.status(error.httpStatusCode).render(...);
    // res.redirect('/500');
    res.status(500).render('500', {
      pageTitle: 'Error!',
      path: '/500',
      isLoggedIn: req.session.isLoggedIn
    });
  });

module.exports = router;