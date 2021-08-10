var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var CatagoryRouter = require('./routes/Catagories.routes');
var DataItemCodeRouter = require('./routes/DataItemCode.routes');
var DepartmentRouter = require('./routes/Department.routes');
var EmployeeRouter = require('./routes/Employee.routes');
var EntryRouter = require('./routes/Entry.routes');
var UnitRouter = require('./routes/Unit.routes');
var UserRouter = require('./routes/Users.routes');
var FinancialyrsRouter = require('./routes/Financialyrs.routes');
var FormulaRouter = require('./routes/Formula.routes');
var groupdataitemcode = require('./routes/Groupdataitemcode.routes');
var groupuserdetail = require('./routes/GroupuserItemcode.routes');
var groupusers = require('./routes/Groupusers.routes');

var groupemployeeRouter = require('./routes/GroupEmployee.routes');








var app = express();

//Databaseconnection
const mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost:27017/Imetro'); 
var db = mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  next();
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/category', CatagoryRouter);
app.use('/unit',UnitRouter);
app.use('/department',DepartmentRouter);
app.use('/employee', EmployeeRouter);
app.use('/entry',EntryRouter);
app.use('/department',DepartmentRouter);
app.use('/dataitemcode',DataItemCodeRouter);
app.use('/users',UserRouter);
app.use('/finanyrs',FinancialyrsRouter);
app.use('/formula',FormulaRouter);
app.use('/groupdataitemcode',groupdataitemcode);
app.use('/groupuserdetail',groupuserdetail);
app.use('/groupusers',groupusers);
app.use('/groupemployee',groupemployeeRouter);















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
