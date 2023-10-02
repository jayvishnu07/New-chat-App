const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    textMessage: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
},
    { timestamps: true }
)

const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;
