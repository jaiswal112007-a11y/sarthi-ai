const express = require('express');
const router = express.Router();
const { readDocument } = require('../controllers/documentController');

router.post('/', readDocument);

module.exports = router;