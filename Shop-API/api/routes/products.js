const router  = require('express').Router();
const express = require('express');

router.get('/', (req,res,next) => { //app.jsde productRoute yaptın /products yazmana gerek yok
    res.status(200).json({
        message: 'handling products get request'
    });
});

router.get('/:productId', (req,res,next) => {
    const id = req.params.productId;
    if (id === 'special'){
        res.status(200).json({
            message: 'Message with special id',
            id: id
        });
    }else {
        res.status(200).json({
            message: 'Wrong id!'
        });
    }  
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
    const product = {
        name: req.body.name,
        price: req.body.price
    };
    res.status(201).json({
        message: 'handling products post request',
        createdProduct: product
    });
});

module.exports = router;