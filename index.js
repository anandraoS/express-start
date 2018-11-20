const express = require('express');
const app = express();
const log = require('./middleware/logger');
const morgan = require('morgan');
const helmet = require('helmet');
const config = require('config');
const courses = require('./routes/courses');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const home = require('./routes/home');
app.use(express.json());
app.use('/api/courses', courses);
app.use('/', home);
const Joi = require('joi');




console.log(`NODE_ENV : ${process.env.NODE_ENV}`);
console.log(`app ; ${app.get('env')}`);
if (app.get('env') === 'development') {

    app.use(morgan('tiny'));
    console.log('we are using morgan');
}
startupDebugger('we are in startup debugger');
dbDebugger('we are in db debugger');

console.log('Application name : ' + config.get('name'));
console.log('Mail Server name : ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));
app.use(log);
app.use(express.urlencoded({ extended: true }));
app.use(helmet());


app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', './views');


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to port ${port}....`));

