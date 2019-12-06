const router  = require('express').Router();
const express = require('express');
const mongoose = require('mongoose');
const Order = require('../model/order');
const Product = require('../model/product');
const checkAuth = require('../../middleware/check-auth');
const OrderController = require('../controllers/orders');

router.get('/', checkAuth,OrderController.orders_get_all);

router.post('/', checkAuth, OrderController.orders_post);

router.get('/:orderId', checkAuth, OrderController.orders_get_order);

router.delete('/:orderId', checkAuth, OrderController.orders_delete);

module.exports = router;
