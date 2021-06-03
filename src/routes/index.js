const pool = require('../database');
const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../lib/auth');


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

router.get('/my-event', isLoggedIn, async (req, res) => {
    const user = await pool.query('SELECT * FROM usuarios WHERE id = ?', [req.user.id]);
    if(req.user.rol_id == 1 || req.user.rol_id == 2){
        res.render('myevent');
    }else if(req.user.rol_id == 3){
        res.render('index');
    } 
})

router.post('/my-event/add-data', isLoggedIn, async(req, res) => {
    const { title, description, image, phone, animator, artist, datestart, datefinish, hour, location, type, age, streaming, producer, capacity } = req.body;
    const newData = {
        title, 
        description,
        image,
        phone,
        animator,
        artist,
        datestart, 
        datefinish,
        hour,
        location,
        type,
        age,
        streaming, 
        producer, 
        capacity,
        usuarios_id: req.user.id
    }
    await pool.query('INSERT INTO eventos SET ?', [newData]);
    req.flash('success', 'New data added');
    res.redirect('/events');
 });  


module.exports = router;