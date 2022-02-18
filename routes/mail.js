const express = require('express');
const MailController = require('../controllers/MailController');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/send', MailController.sendMail);

module.exports = router;
