const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../lib/auth');
const pool = require('../database');

router.get('/admin', isLoggedIn, async(req, res) => {
    const user = await pool.query('SELECT * FROM usuarios WHERE id = ?', [req.user.id]);
    const data = await pool.query('SELECT * FROM eventos', [req.user.id]);
    if(req.user.rol_id == 1){
        res.render("admin/admin", {
            name: req.user.fullname , user, data
        });
    }else if(req.user.rol_id == 2 || req.user.rol_id == 3){
        res.status(404).send("Acceso denegado");
    } 
    
});

router.get('/admin/add', isLoggedIn, async(req, res) => {
    if(req.user.rol_id == 1){
        res.render("admin/add", {
            user: req.user.fullname
        });
    }else if(req.user.rol_id == 2 || req.user.rol_id == 3){
        res.status(404).send("Acceso denegado");
    } 
});

router.post('/admin/add-data', isLoggedIn, async(req, res) => {
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
   res.redirect('/admin');
});  

router.get('/admin/data-delete/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM eventos WHERE id = ?', [id]);
    req.flash('success', 'Data delete');
    res.redirect('/admin');
});

router.get('/admin/data-edit/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const data = await pool.query('SELECT * FROM eventos WHERE id = ?', [id]);
    res.render('admin/edit', {data: data[0]});
});

router.post('/admin/data-edit/:id', async (req, res) => {
    const {id} = req.params;
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
       capacity
    };
    await pool.query('UPDATE eventos SET ? WHERE id = ?', [newData, id]);
    req.flash('success', 'Data updated');
    res.redirect('/admin');
});

module.exports = router;