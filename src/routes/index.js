const { isLoggedIn } = require('../lib/auth');
const pool = require('../database');
const express = require('express');
const router = express.Router();

router.get('/', isLoggedIn, async (req, res) => {
    const data = await pool.query('SELECT * FROM eventos');
    res.render('index', {data});
})

module.exports = router;