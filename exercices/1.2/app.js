var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var filmsRouter = require('./routes/films')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { nextTick } = require('process');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const info = {};

app.use((req, res, next)=>{
    const getInfo = `${req.method} ${req.path}`;
    const timesInfo = info[getInfo];

    if(timesInfo === undefined){
        info[getInfo] = 0;
    }
    info[getInfo] += 1;
    const infoMessage = `Request counter : \n${Object.keys(info)
        .map((operation) => `- ${operation} : ${info[operation]}`)
        .join('\n')}
          `;
      console.log(infoMessage);
      next();
})

app.use(express.static(path.join(__dirname, 'public')));

app.use('/films', filmsRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
