const path = require ('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')
const fs = require('fs')

// Load config
dotenv.config({path: './config/config.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

// Body Parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override
app.use(
    methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it 
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Template Engines Helpers
const {FormatDate} = require('./helpers/html')

// Template Engines
app.engine('html', require('./views/template'), FormatDate);
app.set('views', './public'); // specify the views directory
app.set('view engine', 'html'); // register the template engine

// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl:process.env.MONGO_URI })
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var
// app.use(function (req, res, next){
//     res.locals.user = req.user || null
//     next
// })

// Declaring Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes 
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    })