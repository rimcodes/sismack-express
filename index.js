require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan');
const cors = require('cors')
const path = require('path')

// Parsing multi-part formdata
var bodyParser = require('body-parser');

const connectDB = require('./config/dbConn')
const {authJwt} = require('./middleware/jwt');


const app = express()

const PORT = process.env.PORT || 3500


connectDB()

app.use(morgan('dev'))
// app.use(cors(corsOptions))
app.use(cors())
app.options('*', cors())

app.use(express.json())

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(authJwt())


app.use('/', require('./routes/root'))
app.use('/categories', require('./routes/categoryRoutes'))
app.use('/auth/update-image', require('./routes/imageRoute'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/products', require('./routes/productRoutes'))

// Wildcard for all unknown endpoints
app.all('/*', (req, res)=> {
    res.status(404)

    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if(req.accepts('json')) {
        res.json({ message: '404 Not Found'})
    } else {
        res.type('txt').send('404 Not Found')
    }
})

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Sismack server running on port ${PORT}`);
    })
})

mongoose.connection.on('error', err => {
    console.log(err)
})