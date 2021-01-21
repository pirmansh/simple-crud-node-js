const express     = require('express');
const fileupload  = require('express-fileupload');
const session     = require('express-session');
const bodyParser  = require('body-parser');
const path        = require('path');
const flash       = require('connect-flash');

const app         = express();
const port        = 2000;

const authRoutes = require('./routes/auth.routes'),
     adminRoutes = require('./routes/admin.routes'),
     dataRoutes  = require('./routes/data.routes'),
     errorRoutes = require('./routes/error.routes');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

// configure midleware
app.set('port', process.env.port || port)
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload());

// routes for the app
app.use(authRoutes);
app.use('/data',dataRoutes);
app.use('/admin', adminRoutes);

// 404
app.use(errorRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    res.redirect('/500');
});

// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});