const config = require('../configs/database');
const mysql = require('mysql');
const session = require('express-session');
const express = require('express');
const connection = mysql.createConnection(config);
connection.connect();

const app = express();

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

//menampilkan semua data
const getDataBarang = async (req, res) => {
    try{const data = await new Promise((resolve,reject) => {
        connection.query('SELECT * FROM barang' , function (error, rows) {
            if (rows) {
                resolve(rows);
            } else {
                reject([]);
            }
        });
    });
    if (req.session.loggedin) { 
        res.send({
            success: true,
            message: 'berhasil ambil data',
            data: data
        });
    } else {
        res.send({
            success: false,
            message: 'Silahkan Login Terlebih Dahulu',
        });
    }
}
     catch (error) {
        console.info(error);
        res.send({
            success: false,
            message: error.stack
        });
    }
}


// menambahkan data
const addDataBarang = async(req, res) => {
    try{let total = req.body.harga * req.body.jumlah
        let potongan
        // jika user membeli dengan harga ...
        if (total > 100000 ) {
             potongan = 10000;
        } else {
             potongan = 0;
        }
    
        // total harga
        let total_harga = total - potongan;
    
        let data = {
    
            nama_barang: req.body.nama_barang,
            harga: req.body.harga,
            jumlah: req.body.jumlah,
            potongan: potongan,
            total_harga: total_harga
        }
        const result = await new Promise((resolve, reject) => {
            connection.query('INSERT INTO barang SET ?;', [data], function(error, rows) {
                if (rows) {
                    resolve(true);
                } else {
                    reject(false);
                }
            });
        });
        (result) 
            res.send({
                succes: true,
                message: 'Berhasil menambahkan data'
            });
         } 
     catch (error) {
            console.log(error);
        res.send({
            succes: false,
            message: error.stack
        });
    }
}

//mengubah data
const editDataBarang = async(req, res) => {
    try{let kode_barang = req.params.kode_barang;

        let total = req.body.harga * req.body.jumlah;
    
        let potongan;
        // jika user membeli dengan harga ...
        if (total > 100000 ) {
             potongan = 10000;
        } else {
             potongan = 0;
        }
    
        // total harga
        let total_harga = total - potongan;
    
        let dataEdit = {
            nama_barang: req.body.nama_barang,
            harga: req.body.harga,
            jumlah: req.body.jumlah,
            potongan: potongan,
            total_harga: total_harga
        }
    
        const result = await new Promise((resolve, reject) => {
            connection.query('UPDATE barang SET ? WHERE kode_barang = ?;', [dataEdit, kode_barang], function(error, rows) {
                if (rows) {
                    resolve(true);
                } else {
                    reject(false);
                }
            });
        });
    
        (result) 
            res.send({
                succes: true,
                message: 'Berhasil edit data'
            });
         }
    catch (error) {
        res.send({
            succes: false,
            message: error.stack
        });
    }
}

//menghapus data
const deleteDataBarang = async(req, res) => {
    try{let kode_barang = req.params.kode_barang;

        const result = await new Promise((resolve, reject) => {
            connection.query('DELETE FROM barang WHERE kode_barang = ?;', [kode_barang], function (error, rows) {
                if (rows) {
                    resolve(true);
                } else {
                    reject(false);
                }
            });
        });
    
         (result) 
            res.send({
                succes: true,
                message: 'Berhasil menghapus data'
            })
        } catch (error) {
        res.send({
            succes: false,
            message: 'Gagal menghapus data'
        }); 
    }
}

module.exports ={
    getDataBarang,
    addDataBarang,
    editDataBarang,
    deleteDataBarang
}