const express = require('express');

const router = express.Router();

const postsController = require('../controller/postsController');

router.get('/firstpost', postsController.posts);

module.exports = router;