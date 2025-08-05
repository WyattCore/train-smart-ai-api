const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const OpenAI = require("openai");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
require('dotenv').config();

app.use(express.json());
app.use(cors());

const saved_plans = [];
const debug = {};

if (!OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is missing. Please set the environment variable.");
    process.exit(1);
  }
const openai = new OpenAI({apiKey: OPENAI_API_KEY});
let input = ""



app.post('/api', (req,res) =>{
    input = req.body.input
    res.json({response: req.body.input})
})

app.get("/api", async(req, res) =>{
    try{
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "user", content: input}
            ]
        });
        res.json({response: completion.choices[0].message.content})
    }catch (error){
        console.error("Error calling OpenAi API",error);
        res.status(500).json({error: "could not get response from Openai"})
}
});


app.post('/saved', (req, res) => {
    try{
        saved_plans.push(req.body);
        debug = req;
        console.log("Backend data: ", req.body);
        res.status(200).send({ message: 'Object saved successfully!' });
    } catch (error) {
        console.error("error saving plan: ", error);
        res.status(500).send({ error: 'Failed to save plan'});
    }
});


app.get('/get', (req,res) => {
    if(saved_plans) {
        res.json(saved_plans);
        res.json(debug);
    }else{
        res.status(404).json({message: "No object found"});
    }
});

app.get('/', (req, res) =>{
    res.send('Welcome to the Train Smart AI API.')
});

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`)
});
