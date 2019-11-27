const router  = require('express').Router();
const express = require('express');
const Product = require('../model/product');
const mongoose = require('mongoose');


router.get('/', (req,res,next) => { //app.jsde productRoute yaptın /products yazmana gerek yok
    Product.find().exec().then(docs => {
        console.log(docs);
        if(docs.length >= 0) {
            res.status(200).json(docs);
        }else {
            res.status(404).json({
                message: 'there is no data in db'
            })
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

router.get('/:productId', (req,res,next) => {
    const id = req.params.productId;

    Product.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({
                message: 'No valid data found.'
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.patch('/:productId', (req,res,next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops in updateOps){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id:id}, {$set: {
        name: req.body.newname,
        price: req.body.newprice
    }}).exec().then(result => {
        console.log(result);
        res.status(200).json(result);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:productId', (req,res,next) => {
    const id = req.params.productId;
    Product.deleteOne({ _id: id}).exec().then(result => {
        console.log(result);
        res.status(200).json(result);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
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
            {console.log(result)
                res.status(201).json({
                    message: 'handling products post request',
                    createdProduct: product
                });
            })
        .catch(err => {console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

module.exports = router;
