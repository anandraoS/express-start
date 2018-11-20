const express = require('express');
const app = express();
const log = require('./logger');
const morgan = require('morgan');
const helmet = require('helmet');
const config = require('config');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

app.use(express.json());

const Joi = require('joi');



const courses = [
    { id: 1, name: 'cource1' },
    { id: 2, name: 'cource2' },
    { id: 3, name: 'cource3' },
    { id: 4, name: 'cource4' }
];


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
app.set('views','./views');
app.get('/', (req, res) => {
    res.render ('index',{title: 'myExpressApp', message:'Hellow'});
});


app.get('/api/courses', (req, res) => {

    res.send(courses);
})

app.get('/api/courses/:id', (req, res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('the course with given id is not found');
    res.send(course);
})


app.post('/api/courses', (req, res) => {

    const result = validateCourse(req.body);
    const { error } = validateCourse(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('the course with given id is not found');
    const result = validateCourse(req.body);
    const { error } = validateCourse(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    course.name = req.body.name;
    res.send(course);
});


app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('the course with given id is not found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to port ${port}....`));


function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}