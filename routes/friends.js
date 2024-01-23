const express = require('express');
const router = express.Router();
const friendController = require('../controller/friend_controller');

//Send a friend request
router.post('/friendship/add',friendController.addFriend);

//Accept a friend request
// router.post('/friendship/accept', friendController.acceptFriendRequest);

//Remove a friend
// router.post('/friendship/remove',friendController.removeFriend);

module.exports = router;



