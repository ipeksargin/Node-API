const router  = require('express').Router();
const express = require('express');
const Product = require('../model/product');
const mongoose = require('mongoose');


router.get('/', (req,res,next) => { //app.jsde productRoute yaptın /products yazmana gerek yok
    res.status(200).json({
        message: 'handling products get request'
    });
});

router.get('/:productId', (req,res,next) => {
    const id = req.params.productId;

    Product.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.patch('/:productId', (req,res,next) => {
        res.status(200).json({
            message: 'Updated product.'
        });
});

router.delete('/:productId', (req,res,next) => {
    res.status(200).json({
        message: 'Deleted product.'
    });
});

router.post('/', (req,res,next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
        .save()
        .then(result =>
            {console.log(result);
            })
        .catch(err => console.log(err));
    res.status(201).json({
        message: 'handling products post request',
        createdProduct: product
    });
});

module.exports = router;
