const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../lib/auth');
const pool = require('../database');

router.get('/admin', isLoggedIn, (req, res) => {
    const user = await pool.query('SELECT * FROM usuarios WHERE id = ?', [req.user.id]);
    console.log(user);
    res.render('admin', {user});
})

module.exports = router;