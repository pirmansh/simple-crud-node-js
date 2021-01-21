const Bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Data = require('../models/Data');
const fs = require('fs');
const { validationResult } = require('express-validator/check');

exports.getDashboardPage = (req, res, next) => {

  let data = req.session.data;
  Promise.all(([Admin.fetchAll(), Data.fetchAll()]))
    .then(([allAdmin, allData]) => {
          res.render('admin/dashboard', {
            pageTitle: 'Dashboard',
            data: data,
            allAdmin: allAdmin[0],
            allData: allData[0],
            pathParrent: '',
            path: '/admin/dashboard',
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

}

// Tampilan halaman profile
exports.getProfilePage = (req, res, next) => {

  let data = req.session.data;
  let password = req.session.password;

  res.render('admin/profile', {
      pageTitle: 'My Profile',
      data: data,
      password: password,
      pathParrent: '',
      path: '/admin/profile',
      errorMessage: null,
      validationErrors: [],
      msgSuccess: null
  });   

}

// Post Edit Profile
exports.editProfile = (req, res, next) => {
  let data = req.session.data;
  let id  = req.params.id,
      fullname = req.body.fullname,
      password = req.body.password;
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).render('admin/profile', {
          pageTitle: 'My Profile',
          data: data,
          password: password,
          pathParrent: '',
          path: '/admin/profile',
          errorMessage: errors.array()[0].msg,
          validationErrors: errors.array(),
          msgSuccess: null
      });

    }

  Bcrypt.hash(password, 12)
      .then(hashpassword => {
          return Admin.editProfile(hashpassword, fullname, id)
      })
      .then(() => {
          Admin.getAdminById(id)
              .then(result => {

                  let editUser = result[0];
                  req.session.data = editUser;
                  req.session.password = password;
  
                          res.render('admin/profile', {
                            pageTitle: 'My Profile',
                            data: data,
                            password: password,
                            pathParrent: '',
                            path: '/admin/profile',
                            errorMessage: null,
                            validationErrors: [],
                            msgSuccess: true
                        });

                     })
                 })
              .catch(err => {
                  const error = new Error(err);
                  error.httpStatusCode = 500;
                  return next(error);
              });
   
}

// Menampilkan semua Admin
exports.getAllAdminPage = (req, res, next) => {

  let data = req.session.data;
  Admin.fetchAll()
    .then(allAdmin => {
      res.render('admin/all', {
        pageTitle: 'Data Admin',
        data: data,
        allAdmin: allAdmin[0],
        pathParrent: '/admin',
        path: '/admin/all',
        message: req.flash('error', '')
    }); 
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

// Create add admin page
exports.getAddAdminPage = (req, res, next) => {

    let data = req.session.data;

    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    res.render('admin/add', {
        pageTitle: 'Menambah Admin',
        data: data,
        pathParrent: '/admin',
        path: '/admin/add',
        oldInput: {
            fullname: '',
            email: ''
          },
        errorMessage: message,
        validationErrors: [],
        msgSuccess: null
    }); 

}


//POST Add admin

exports.addAdmin = (req, res, next) => {

  let data        = req.session.data;
  let fullname    = req.body.fullname,
  email           = req.body.email,
  password        = req.body.password,
  role            = req.body.role;

  if (!(req.files && req.files.image)) {

        return res.status(422).render('admin/add', {
        pageTitle: 'Add Admin Page',
        data: data,
        pathParrent: '/admin',
        path: '/admin/add',
        oldInput: {
            fullname: fullname,
            email: email
          },
        errorMessage: 'Semua inputan wajib di isi ❌',
        validationErrors: [],
        msgSuccess: null
    });
  }
  
  let uploadedFile    = req.files.image,
      image_name      = uploadedFile.name;

  const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).render('admin/add', {
          pageTitle: 'Menambah Admin',
          data: data,
          pathParrent: '/admin',
          path: '/admin/add',
          oldInput: {
              fullname: fullname,
              email: email
            },
          errorMessage: errors.array()[0].msg,
          validationErrors: errors.array(),
          msgSuccess: null
      });

    }

  let fileExtension = uploadedFile.mimetype.split('/')[1];
      image_name = fullname + '.' + fileExtension;

      Admin.cekEmail(email)
         .then(result => {
          if (result[0].length > 0) {
              return res.status(422).render('admin/add', {
                pageTitle: 'Menambah Admin',
                data: data,
                pathParrent: '/admin',
                path: '/admin/add',
                oldInput: {
                    fullname: fullname,
                    email: email
                  },
                errorMessage: 'Email sudah terpakai, coba yang lain!',
                validationErrors: [],
                msgSuccess: null
              });

          } else {
              if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                  // upload the file to the /public/assets/imgages/avatar directory
                  uploadedFile.mv(`public/assets/images/avatar/${image_name}`, (err ) => {
                      if (err) {
                          const error = new Error(err);
                          error.httpStatusCode = 500;
                          return next(error);
                      }
                      // send the users details to the database
                      return Bcrypt.hash(password, 12)
                      .then(hashpassword => {
                          const admin = new Admin(email, hashpassword, fullname, image_name, role);
                          return admin.save()
                      })
                      .then(() => {
                          res.render('admin/add', {
                              pageTitle: 'Add Admin Page',
                              data: data,
                              path: '/admin/add',
                              pathParrent: '/admin',
                              oldInput: {
                                fullname: '',
                                  email: '',
                              },
                              errorMessage: null,
                              validationErrors: [],
                              msgSuccess: true
                          }); 
                      })
                      .catch(err => {
                          const error = new Error(err);
                          error.httpStatusCode = 500;
                          return next(error);
                      });
                  });

              } else {  
                  req.flash('info', 'warning');
                  res.redirect(`/admin/add`);
          }
      }
  })
  .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  });
}

exports.getEditAdminPage = (req, res, next) => {

    let data = req.session.data;
    let id   = req.params.id;

    Admin.getAdminById(id)
      .then(allAdmin => {
              res.render('admin/edit', {
              pageTitle: 'Edit Admin',
              data: data,
              allAdmin: allAdmin[0],
              pathParrent: '/admin',
              path: '/admin/edit',
              oldInput: {
                  fullname: ''
                },
              errorMessage: null,
              validationErrors: [],
              msgSuccess: null
          });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
}


// Post Edit Admin
exports.editAdmin = (req, res, next) => {
   
  let id     = req.params.id,
  fullname        = req.body.fullname,
  role            = req.body.role;
  let data        = req.session.data;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {

   return Admin.getAdminById(id)
    .then(allAdmin => {
            res.render('admin/edit', {
            pageTitle: 'Edit Admin',
            data: data,
            allAdmin: allAdmin[0],
            pathParrent: '/admin',
            path: '/admin/edit',
            oldInput: {
                fullname: fullname
              },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
            msgSuccess: null
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

  } else {
      Admin.update(fullname, role, id)
      .then(() => {
        return  Admin.getAdminById(id)
      })
      .then(allAdmin => {
              res.render('admin/edit', {
              pageTitle: 'Edit Admin',
              data: data,
              allAdmin: allAdmin[0],
              pathParrent: '/admin',
              path: '/admin/edit',
              oldInput: {
                  fullname: ''
                },
              errorMessage: null,
              validationErrors: [],
              msgSuccess: true
          });
      })
      .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
      });
  }

}


// Reset password page
exports.resetPasswordPage = (req, res) => {
  let data = req.session.data;
  let id = req.params.id;

  Admin.getAdminById(id)
  .then(allAdmin => {
          res.render('admin/reset_password', {
          pageTitle: 'Reset Password',
          data: data,
          allAdmin: allAdmin[0],
          pathParrent: '/admin',
          path: '/admin/reset-password',
          errorMessage: null,
          validationErrors: [],
          msgSuccess: null
      });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });

}

// Reset password
exports.resetPassword = (req, res) => {
  let id = req.params.id;
  let password = req.body.password;
  let data = req.session.data;

const errors = validationResult(req);

if (!errors.isEmpty()) {

  return Admin.getAdminById(id)
  .then(allAdmin => {
          res.render('admin/reset_password', {
          pageTitle: 'Reset Password',
          data: data,
          allAdmin: allAdmin[0],
          pathParrent: '/admin',
          path: '/admin/reset-password',
          errorMessage: errors.array()[0].msg,
          validationErrors: errors.array(),
          msgSuccess: null
      });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });

} else {
  Admin.getAdminById(id)
  .then(() => {
     return Bcrypt.hash(password, 12)
          })
              .then((hashpassword) => {
                  return Admin.resetPassword(hashpassword, id)
                  })
                      .then(() => {
                          return Admin.getAdminById(id)
                              }).then(allAdmin => {
                                res.render('admin/reset_password', {
                                pageTitle: 'Reset Password',
                                data: data,
                                allAdmin: allAdmin[0],
                                pathParrent: '/admin',
                                path: '/admin/reset-password',
                                errorMessage: '',
                                validationErrors: [],
                                msgSuccess: true
                            });
                        })
                        .catch(err => {
                          const error = new Error(err);
                          error.httpStatusCode = 500;
                          return next(error);
                        });
}
                        
}

// Delete Admin
exports.deleteAdmin = (req, res, next) => {

  let _id = req.params.id;
  let data;
  let imgUrl;
           
  Admin.getAdminById(_id)
  .then(results => {
    data = results[0];
    return Admin.delete(_id)
  })
    .then(() => {
         req.flash('error', 'success');
         res.redirect(`/admin/all`);
         data.forEach(admin => {
            imgUrl = admin.image;
         })     
         fs.unlink(`public/assets/images/avatar/${imgUrl}`, (err) => {
             if (err) {
                 console.error(`gagal menghapus gambar: ${err}`);     
              }
            })
         })
     .catch(err => {
         const error = new Error(err);
         error.httpStatusCode = 500;
         return next(error);
     });
}

