const express = require('express');
const chats = require('./data/data');
const app = express();
const { default: mongoose } = require('mongoose');
require('dotenv').config();

const userRoute = require('./Routers/userRoute')
const chatRoute = require('./Routers/chatRoute')
const messageRoute = require('./Routers/messageRoute')
const { notFound, errorHandler } = require('./config/middleware/errorHandler');
const cors = require('cors');
app.use(cors())

app.use(express.json())


mongoose.connect('mongodb://localhost/Chat_Application')
    .then(() => console.log('Connected to Database..!!'))
    .catch((error) => console.log('Error occured', error))


app.use('/user', userRoute)
app.use('/api', chatRoute)
app.use('/messages', messageRoute)

app.get('/', (req, res) => {
    res.send("hello world")
})



app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server is Running on ${PORT}`))



const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
        // credentials: true,
    },
});

io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
    });
    socket.on("typing", () => socket.broadcast.emit("typing"));
    socket.on("stop typing", () => socket.broadcast.emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.users) return 
        socket.broadcast.emit("message recieved", newMessageRecieved);
    });

    socket.off("setup", () => {
        socket.leave(userData._id);
    });
});
