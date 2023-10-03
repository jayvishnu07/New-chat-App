const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recentMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    groupProfile: {
        type: String,
        default: 'https://freesvg.org/img/abstract-user-flat-4.png',
    },
},
    {
        timestamps: {
            currentTime: () => new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
        }
    }
)

const ChatModel = mongoose.model('Chat', ChatSchema);

module.exports = ChatModel;