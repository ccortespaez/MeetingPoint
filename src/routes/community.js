const express = require('express');
const { isLoggedIn } = require('../lib/auth');
const pool = require('../database');
const router = express.Router();

router.get('/admin/all', isLoggedIn, async (req, res) => {
    const data = await pool.query('SELECT * FROM eventos');
    res.render('admin/all', {data});
})

router.get('/admin/view-event/:id', async (req, res) => {
    const {id} = req.params;
    const data = await pool.query('SELECT * FROM eventos WHERE id = ?', [id]);
    console.log(data[0]);
    res.render('admin/view', {data: data[0]});
})

module.exports = router;