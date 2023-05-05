const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const session = require('express-session');

const connection = mysql.createConnection({
    host        : 'localhost',
    user        : 'root',
    password    : '',
    database    : 'project'
});

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

// definisi enviroment secara global (.env)
require('dotenv').config();

// convert data ke json
app.use(bodyParser.urlencoded({ extended : false }))
app.use(bodyParser.json())

// memanggil route 
const appRoute = require('./src/routes');
app.use('/', appRoute);

app.post('/login', function (req, res) {
    
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
        connection.query('SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password], function(error, result, fields) {

            if (error) throw error; 

            if (result.length > 0) {

                req.session.loggedin = true;
                req.session.username = username;
                req.session.password = password;

                res.send({

                    success: true,
                    message: 'login berhasil !'
                });
            } else {
                res.send({
                    success:true,
                    message: 'login gagal !'
                });
            }
            res.end();
        });
    } else {
        res.send({
            success:true,
            message: 'Please enter the Correct Username and Password!'
        });
        res.end();
    }

    
        
    
})

// menjalankan server sesuai dengan port yang terdaftar di .env (8080)
app.listen(process.env.APP_PORT, () => {
    console.log(`Server Berjalan http://localhost:${process.env.APP_PORT}`);
});