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
app.listen(PORT, () => console.log(`Server is Running on ${PORT}`))

