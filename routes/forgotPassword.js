const express = require('express');
const passport = require('passport');
const router = express.Router();

const forgotPasswordController = require('../controller/forgotPassword_controller')

router.get('/forgot-password', forgotPasswordController.forgot );

router.post('/forgot-password', forgotPasswordController.setEmail);

router.get('/reset-password/:token', forgotPasswordController.getResetPassword);
router.post('/reset-password/:token', forgotPasswordController.resetPassword);

module.exports = router;