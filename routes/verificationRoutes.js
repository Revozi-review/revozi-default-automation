const express = require('express');
const router = express.Router();
const verification = require('../controllers/verificationController');

router.post('/start', verification.startVerification);
router.post('/confirm', verification.confirmVerification);

module.exports = router;
