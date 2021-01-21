const bcrypt                 = require('bcryptjs');
const Admin                  = require('../models/Admin');
const { validationResult }   = require('express-validator/check');


// Masuk
exports.getLoginPage =  (req, res, next) => {

    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    // if user login, redirect to dashboard
    if (req.session.loggedin) {
        res.redirect('/admin/dashboard');
    } 
    // show Masuk
    else {
        res.render('auth/login', {
            pageTitle: 'Masuk',
            errorMessage: message,
            path: '/login',
            oldInput: {
              email: '',
            },
            validationErrors: []
        });        
    }
}


// process login
exports.prosesLogin = (req, res, next) => {

  // get name="email" & "password"
  const email = req.body.email;
  const password = req.body.password;

  let pass,
      user;
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
          pageTitle: 'Masuk',
          path: '/login',
          errorMessage: errors.array()[0].msg,
          oldInput: {
            email: email,
          },
          validationErrors: errors.array()
        });
      } else {
  // check if user exists
  Admin.cekEmail(email)
  .then(results => {

      results[0].forEach(rest => {
         return pass = rest.password,
                user = rest.email;
      });
      return results[0];
  })

  .then((results) => {
      if (!user) {
          return res.status(422).render('auth/login', {
              pageTitle: 'Masuk',
              path: '/login',
              errorMessage: 'Error: alamat email belum terdaftar dimari! ❌',
              oldInput: {
                email: email,
              },
              validationErrors: [{param: 'email'}]
            });
      } 
      bcrypt
          .compare(password, pass)
          .then(doMatch => {
              
              if(doMatch){

                  req.session.loggedin = true;
                  req.session.password = password;
                  req.session.email = email;
                  req.session.data = results;
                  res.redirect('/admin/dashboard');

              } else {
                  return res.status(422).render('auth/login', {
                      pageTitle: 'Masuk',
                      path: '/login',
                      errorMessage: 'Error: password yang anda masukan salah! ❌',
                      oldInput: {
                        email: email,
                      },
                      validationErrors: [{param: 'password'}]
                    });
              }

          })

      })
      .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
      });

    }

}

exports.prosesLogout = (req, res) => {

  req.session.loggedin = false;
  req.flash('info', 'success');
  res.redirect('/');
  
}