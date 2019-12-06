const router  = require('express').Router();
const express = require('express');
const Product = require('../model/product');
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../../middleware/check-auth');
const ProductController = require('../controllers/products');


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/')
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }else 
    {cb(null, false);}
}

const upload = multer({storage: storage, limits: {
    fileSize: 1024*1024*5 },
    fileFilter: fileFilter
});

router.get('/', ProductController.product_get_all);

router.get('/:productId', ProductController.product_get_id);

router.patch('/:productId', checkAuth, ProductController.product_update);

router.delete('/:productId', checkAuth, ProductController.product_delete);

router.post('/',upload.single('productImage'),checkAuth, ProductController.product_post);

module.exports = router;
