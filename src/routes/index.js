const { isLoggedIn } = require('../lib/auth');
const pool = require('../database');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const data = await pool.query('SELECT * FROM eventos');
    res.render('index', {data});
});

router.get('/view-event/:id', async (req, res) => {
    const {id} = req.params;
    const data = await pool.query('SELECT * FROM eventos WHERE id = ?', [id]);
    res.render('event', {data: data[0]});
})

module.exports = router;