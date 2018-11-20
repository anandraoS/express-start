const express = require('express');
const router = express.Router();


const courses = [
    { id: 1, name: 'cource1' },
    { id: 2, name: 'cource2' },
    { id: 3, name: 'cource3' },
    { id: 4, name: 'cource4' }
];

router.get('/', (req, res) => {

    res.send(courses);
})

router.get('/:id', (req, res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('the course with given id is not found');
    res.send(course);
})


router.post('/', (req, res) => {

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

router.put('/:id', (req, res) => {
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


router.delete('/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('the course with given id is not found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
})


function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

module.exports = router;
