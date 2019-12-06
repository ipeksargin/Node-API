const Product = require('../model/product');
const mongoose = require('mongoose');

exports.product_get_all = (req,res,next) => { //app.jsde productRoute yaptın /products yazmana gerek yok
    Product.find()
    .select('name price _id productImage')
    .exec().then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                name: doc.name,
                price: doc.price,
                _id: doc._id,
                productImage: doc.productImage,
                request:{
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + doc._id
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
}

exports.product_get_id = (req,res,next) => {
    const id = req.params.productId;

    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + doc._id
                }
            });
        })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.product_post = (req,res,next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(result =>
            {console.log(result)
                res.status(201).json({
                    message: 'Product is created successfully',
                    createdProduct: {
                        name: result.name,
                        price: result.price,
                        _id: result._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + result._id
                        }
                    }
                });
            })
        .catch(err => {console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

exports.product_delete = (req,res,next) => {
    const id = req.params.productId;
    Product.deleteOne({ _id: id}).exec()
    .then(result => {
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products',
                body: { name: 'String', price: 'number'} 
            }
        });
    }).catch(err => {
            console.log(err);
            res.status(500).json(err);
    });
}
exports.product_update = (req,res,next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    //const updated = await Product.update({_id:id},{$set:updateOps})
    Product.update({_id:id}, {$set: updateOps}).exec().then(result => {        
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id 
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}