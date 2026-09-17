const express = require('express');
const router = express.Router();
const { simplifyText } = require('../controllers/simplifyController');

router.post('/', simplifyText);

module.exports = router;