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
});

router.post('/view-event/:id', async (req, res) => {
    const {id} = req.params;
    const data = await pool.query('SELECT * FROM eventos WHERE id = ?', [id]);
    res.render('event', {data: data[0]});
});

router.get('/events', async (req, res) => {
    const data = await pool.query('SELECT * FROM eventos');
    res.render('events', {data})
});

router.get('/my-event', (req, res) => {
    res.render('myevent');
})

module.exports = router;