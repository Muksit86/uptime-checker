const express = require('express');
const { checkWebsite, getHistory } = require('../controllers/checkController');
const router = express.Router();

router.post('/check', checkWebsite);
router.get('/history', getHistory);

module.exports = router;