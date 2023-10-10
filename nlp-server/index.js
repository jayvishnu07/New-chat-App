const { NlpManager } = require('node-nlp');
const express = require("express")
const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cors())
const manager = new NlpManager({ languages: ['en'], forceNER: true ,nlu: { log: false }});
// Adds the utterances and intents for the NLP
manager.addDocument('en', 'bye', 'greetings.bye');
manager.addDocument('en', 'byebye', 'greetings.bye');
manager.addDocument('en', 'seeYou', 'greetings.bye');
manager.addDocument('en', 'seeyou', 'greetings.bye');
manager.addDocument('en', 'goodBye', 'greetings.bye');
manager.addDocument('en', 'goodbye', 'greetings.bye');
manager.addDocument('en', 'hello', 'greetings.hello');
manager.addDocument('en', 'helloThere', 'greetings.hello');
manager.addDocument('en', 'hi', 'greetings.hello');
manager.addDocument('en', 'welcome', 'greetings.hello');
manager.addDocument('en', 'hithere', 'greetings.hello');
manager.addDocument('en', 'hiThere', 'greetings.hello');
manager.addDocument('en', 'howdy', 'greetings.hello');

// Train also the NLG
manager.addAnswer('en', 'greetings.bye', 'see you later');
manager.addAnswer('en', 'greetings.bye', 'see you soon!');
manager.addAnswer('en', 'greetings.bye', 'Catch you later');
manager.addAnswer('en', 'greetings.bye', 'Stay safe');
manager.addAnswer('en', 'greetings.hello', 'Hey there!');
manager.addAnswer('en', 'greetings.hello', 'Greetings!');
manager.addAnswer('en', 'greetings.hello', 'Greetings!');

// Train and save the model.
(async() => {
    await manager.train();
    manager.save();
})();


app.post("/api/v1/suggestions", async (req, res)=>{
    const response = await manager.process('en', req.query.text);
    res.send(response.answers)
    console.log(response);
})

app.listen(8081, (err)=>{
    if(err)console.log("Error in starting the server : ", err)
    else {
        console.log("server started successfully at port 8081")
    }
})