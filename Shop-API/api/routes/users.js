const router  = require('express').Router();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const jwt =  require('jsonwebtoken');
const UserController = require('../controllers/users');
const checkAuth = require('../../middleware/check-auth');


router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/:userId', checkAuth, UserController.user_delete);
module.exports = router;
