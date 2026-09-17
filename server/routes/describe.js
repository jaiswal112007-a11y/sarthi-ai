const express = require('express');
const router = express.Router();
const { describeScene } = require('../controllers/describeController');

router.post('/', describeScene);

module.exports = router;