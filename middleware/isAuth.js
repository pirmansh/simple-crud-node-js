module.exports = (req, res, next) => {

    if (!req.session.loggedin) {
        req.flash('info', 'error');
        res.redirect('/');
    } else {
        next();
    }
    
}