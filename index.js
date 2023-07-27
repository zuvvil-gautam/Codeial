const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');


const app = express();

const port = 8000;

const expressLayouts = require('express-ejs-layouts');

const db = require('./config/mongoose');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

//for static files such as css,js
app.use(express.static('./assets'));

app.use(expressLayouts);

//extract style and scripts from sub pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);



//set up the view engine
app.set('view engine', 'ejs');
app.set('views','./views');

app.use(session({
    name: 'codeial',
    secret:'secretkey123456789', // change the secret before deployment in production mode
    saveUninitialized: false,
    resave:false,
    cookie: {
        maxAge: (1000 * 60 *100)
    }

}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//use express router
app.use('/', require('./routes'));

app.listen(port,function(err){
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is up and running on port: ${port}`);
})