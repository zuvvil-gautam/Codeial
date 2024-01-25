const express = require('express');
const passport = require('passport');
const router = express.Router();

const forgotPasswordController = require('../controller/forgotPassword_controller')

router.get('/forgot-password', forgotPasswordController.forgot );

module.exports = router;