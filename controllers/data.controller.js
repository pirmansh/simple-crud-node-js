const Data                   = require('../models/Data');
const moment                 = require('moment');
const { validationResult }   = require('express-validator/check');

// Menampilkan semua Data
exports.getAllData = (req, res, next) => {

    let data = req.session.data;

    Data.fetchAll()
      .then(allData => {
        res.render('data/all', {
          pageTitle: 'Data',
          data: data,
          allData: allData[0],
          pathParrent: '/data',
          path: '/data/all',
          message: req.flash('error', '')
      }); 
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  }

// add data page
exports.getAddDataPage = (req, res, next) => {

  let data = req.session.data;

  res.render('data/add', {
      pageTitle: 'Menambah Data',
      data: data,
      pathParrent: '/data',
      path: '/data/add',
      oldInput: {
          no_internet: '',
          sn: '',
          alamat: '',
          keterangan: ''
        },
      errorMessage: null,
      validationErrors: [],
      msgSuccess: null
  }); 

}


//POST Add data
exports.addAdmin = (req, res, next) => {

  let data           = req.session.data;
  let no_internet    = req.body.no_internet,
  sn                 = req.body.sn,
  status             = req.body.status,
  alamat             = req.body.alamat,
  keterangan         = req.body.keterangan;
  let tanggal = moment().format('YYYY-MM-DD, HH:mm');

  const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).render('data/add', {
          pageTitle: 'Menambah Data',
          data: data,
          pathParrent: '/data',
          path: '/data/add',
          oldInput: {
              no_internet: no_internet,
              sn: sn,
              alamat: alamat,
              keterangan: keterangan
            },
          errorMessage: errors.array()[0].msg,
          validationErrors: errors.array(),
          msgSuccess: null
      }); 
    } else {
      const saveData = new Data(no_internet, sn, status, alamat, tanggal, keterangan);

      saveData
        .save()
          .then(() => {
                res.render('data/add', {
                  pageTitle: 'Menambah Data',
                  data: data,
                  pathParrent: '/data',
                  path: '/data/add',
                  oldInput: {
                      no_internet: '',
                      sn: '',
                      alamat: '',
                      keterangan: ''
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


// Edit data page
exports.getEditDataPage = (req, res, next) => {

  let data = req.session.data;
  let id   = req.params.id;

  Data.getById(id)
        .then((allData) => {
          res.render('data/edit', {
            pageTitle: 'Edit Data',
            data: data,
            allData: allData[0],
            pathParrent: '/data',
            path: '/data/edit',
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

// POST Edit Data
exports.editData = (req, res, next) => {

  let data           = req.session.data;
  let id             = req.params.id;
  let no_internet    = req.body.no_internet,
  sn                 = req.body.sn,
  status             = req.body.status,
  alamat             = req.body.alamat,
  keterangan         = req.body.keterangan;
  let tanggal = moment().format('YYYY-MM-DD, HH:mm');

  const errors = validationResult(req);

      if (!errors.isEmpty()) {
        Data.getById(id)
        .then((allData) => {
          return res.status(422).render('data/edit', {
                pageTitle: 'Edit Data',
                data: data,
                allData: allData[0],
                pathParrent: '/data',
                path: '/data/edit',
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
      Data.update(no_internet, sn, status, alamat, tanggal, keterangan, id)
        .then(() => {
         return Data.getById(id)
        })
        .then((allData) => {
                  res.render('data/edit', {
                    pageTitle: 'Edit Data',
                    data: data,
                    allData: allData[0],
                    pathParrent: '/data',
                    path: '/data/edit',
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

  // Delete Data
exports.delete = (req, res, next) => {

  let id = req.params.id;
           
  Data.delete(id)
      .then(() => {
        req.flash('error', 'success');
        res.redirect(`/data/all`);
      })
     .catch(err => {
         const error = new Error(err);
         error.httpStatusCode = 500;
         return next(error);
     });
}