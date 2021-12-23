var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const productRouter = require('./app/products/router');
const categoryRouter = require('./app/categories/router');
const tagRouter = require('./app/tags/router');
const authRouter = require('./app/auth/router');
const wilayahRouter = require('./app/wilayah/router');
const deliveryRouter = require('./app/delivery-address/router');
const cartRouter = require('./app/cart/router');
const orderRouter = require('./app/order/router');
const invoiceRouter = require('./app/invoice/router');
const {decodeToken} = require('./app/auth/middleware');

//prevent cors
const cors = require('cors');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//use cors
app.use(cors());
app.use(decodeToken());


/**Bagian Router */
//1. Product
app.use('/api', productRouter);
//2. Category
app.use('/api', categoryRouter);
//3. Tags
app.use('/api', tagRouter);
//4 Auth
app.use('/auth', authRouter);
//5 Wilayah
app.use('/api', wilayahRouter);
//6 Alamat
app.use('/api', deliveryRouter);
//7 Cart
app.use('/api', cartRouter);
//8 Router
app.use('/api', orderRouter);
//9 Invoice
app.use('/api', invoiceRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
