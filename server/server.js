require('./config/config');
const express = require('express')
const mongoose = require('mongoose');
const path = require('path');
const app = express()
const bodyParser = require('body-parser')



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//console.log(path.resolve(__dirname, '../public'));
//Configuracion global de ruta
app.use(require('./routes/index'));

/* mongoose.connect('mongodb://localhost:27017/cafe', () => {
    if (err) throw err;
    console.log('Base de Datos ONLINE');
}); */
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).catch(error => handleError(error));


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
})