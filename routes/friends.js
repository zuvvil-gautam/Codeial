const express = require('express');
const router = express.Router();
const friendController = require('../controller/friend_controller');
const passport = require('passport');

//Send a friend request
router.post('/friendship/add',passport.checkAuthentication,friendController.addFriend);

//Accept a friend request
// router.post('/friendship/accept', friendController.acceptFriendRequest);

//Remove a friend
router.get('/friendship/remove/:id',passport.checkAuthentication,friendController.removeFriend);

module.exports = router;



