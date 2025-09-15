const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

router.post('/forgot-password', userCtrl.forgotPassword);
router.post('/reset-password/:token', userCtrl.resetPassword);

router.delete('/me', auth, userCtrl.deleteUser);

module.exports = router;