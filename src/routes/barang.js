const router = require('express').Router();
const { barang } = require('../controllers');

// GET localhost:8080/biodata => Ambil data semua produk
router.get('/', barang.getDataBarang);

// // GET localhost:8080/biodata/2 => Ambil data semua produk berdasarkan id = 2
// router.get('/:id', produk.getDetailBiodata);

// // // POST localhost:8080/biodata/add => Tambah data produk ke database
router.post('/add', barang.addDataBarang);

// // // PUT localhost:8080/biodata/edit/2 => Edit data produk
router.put('/edit/:kode_barang', barang.editDataBarang);

// // // DELETE localhost:8080/biodata/delete => Delete data produk
router.delete('/delete/:kode_barang', barang.deleteDataBarang);

module.exports = router;