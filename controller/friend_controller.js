const User = require('../models/user');
const Friendship = require('../models/friendship');

// Send a friend request
module.exports.addFriend = async function(request, respond) {
    try {

        console.log('Inside friend controller');

        const fromUserId = request.query.fromUser;
        const toUserId = request.query.toUser;

        // Create a new friendship request
        const friendship = new Friendship({
            from_user: fromUserId,
            to_user: toUserId,
        });

        // Save the friendship request
        await friendship.save();

        // Add the friend to the friendlist of the from_user
        const fromUser = await User.findById(fromUserId);
        fromUser.friendships.push(friendship._id);

        // Add the friend to the friendlist of the to_user
        const toUser = await User.findById(toUserId);
        toUser.friendships.push(friendship._id);

        // Save both users using Promise.all for concurrent updates
        await Promise.all([fromUser.save(), toUser.save()]);

        if (request.xhr) {
            return respond.status(200).json({
                message: 'Friend request sent successfully',
                data: {
                    fromUser: fromUser,
                    toUser: toUser
                }
            })
        }
    } catch (err) {
        return respond.status(500).json({ error: 'Something wet wrong' });
    }
}
