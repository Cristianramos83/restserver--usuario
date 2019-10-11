//==================================
//Puerto
//==================================

process.env.PORT = process.env.PORT || 3000;



// ===========================
// Entorno
// ===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ===========================
// Base de Datos
// ===========================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://strider:P7u9s6keFz8Z4mv@cluster0-0mujn.mongodb.net/cafe';
}
process.env.URLDB = urlDB;