const express = require('express')
const Usuario = require('../models/usuario');

const { verificarToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express()

const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/usuario', verificarToken, (req, res) => {



    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });

        });


})
app.post('/usuario', [verificarToken, verificaAdmin_Role], function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }
        //usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });



})

app.put('/usuario/:id', [verificarToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    let options = {
        new: true,
        runValidators: true
    }

    Usuario.findByIdAndUpdate(id, body, options, (err, usuarioDB) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })


})

app.delete('/usuario/:id', [verificarToken, verificaAdmin_Role], function(req, res) {


    let id = req.params.id;

    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }
        if (usuarioBorrado === null) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })


    })


})

module.exports = app;