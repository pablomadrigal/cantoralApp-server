const express = require('express');
const UserController = require('../controllers/UserController');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/me', UserController.me);

module.exports = router;
