exports.get404 = (req, res, next) => {
    res.status(404).render('error/404', {
      pageTitle: 'Page Not Found',
      path: '/404',
      isLoggedIn: req.session.loggedin
    });
  };
  
  exports.get500 = (req, res, next) => {
    res.status(500).render('error/500', {
      pageTitle: 'Internal Server Error!',
      path: '/500',
      isLoggedIn: req.session.loggedin
    });
  };