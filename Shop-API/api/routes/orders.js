const router  = require('express').Router();
const express = require('express');
const mongoose = require('mongoose');
const Order = require('../model/order');
const Product = require('../model/product');

router.get('/', (req, res, next) => {
    Order.find()
    .select('quantity product _id')
    .populate('product', 'name') //diğer bir modül olarak product olduğu için product yazdık. product içinden sadece name almak istediği için ikinci parameter olarak name verdik
    .exec().then(docs => {
        const response = {
            count: docs.length,
            orders: docs.map(doc => {
                return {
                quantity: doc.quantity,
                product: doc.product,
                _id: doc._id,
                request:{
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + doc._id
                }
            }

            })
        }        
        if(docs.length >= 0) {
            res.status(200).json(response);
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

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId).exec()
    .then(product => {
        // if(!product) {
        //     res.status(404).json({
        //         message: 'Product not found',
        //     })
        // }
        const order = new Order ({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save();
    })
    .then(result => {
        console.log(result); // terminalde bana gösterir 
        res.status(201).json({ //postmanda gelen cevap olarak düşün
            message: "order stored",
            createdOrder: {
                _id: result.id,
                quantity: result.quantity,
                product: result.product
                },
                request: {
                    type: "GET",
                    url: 'http://localhost:3000/orders/' + result._id
                }
            }); 
        })
        .catch(err => {
            res.status(500).json({
                message: 'product hasnt found in the database',
            });
        });
});
router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product').exec().then(order => {
        if(!order) {
            res.status(404).json({
                message: 'order not found'
            })
        }
        console.log(order);
        res.status(201).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/'
            }
        });
    }).catch(err =>{
        res.status(500).json({
            error:err
        });
    });
});

router.delete('/:orderId', (req, res, next) => {
Order.deleteOne({_id:req.params.orderId})
.exec()
.then(result => {
    res.status(200).json({
        message: 'Order deleted',
        request: {
            message: 'To create a new order',
            type: 'POST',
            url: 'http://localhost:3000/orders/',
            body: {
                productId: "ID",
                quantity: "number"
            }
        }
    })
})

    .catch(err =>{
    res.status(500).json({
        error:err
        });
    });

});



module.exports = router;
