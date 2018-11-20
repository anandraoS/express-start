const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'myExpressApp', message: 'Hellow' });
});

module.exports = router;