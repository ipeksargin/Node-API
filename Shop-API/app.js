const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoute = require('./api/routes/products');
const ordersRoute = require('./api/routes/orders');
const usersRoute = require('./api/routes/users');


mongoose.connect('mongodb+srv://db_admin:98sNMmM6o0d3cTiJ@cluster0-hlfkl.mongodb.net/test?retryWrites=true&w=majority',
{ useUnifiedTopology: true,
    useNewUrlParser: true  }).then(() => console.log('DB Connected!'))
    .catch(err => {
    console.log(Error, err.message);
    });

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
     // ANLAMADIM SOR
     //* olması her res anlamına gelir. her res'e bir header atamak gibi düşün
     if(req.method === 'OPTIONS') {
         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
         return res.status(200).json({});
     }
    next();
});


app.use('/products', productRoute);
app.use('/orders', ordersRoute);
app.use('/users', usersRoute);

app.use('/uploads', express.static('uploads'));
app.use((req, res, next) => {
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
