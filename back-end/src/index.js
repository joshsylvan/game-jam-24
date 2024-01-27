const express = require('express')
const OpenAI = require("openai");
const { createSocketServer } = require('./sockets')
const scriptGenerator = require('./scriptGenerator');
const scriptParser = require('./scriptParser');
const imageGenerator = require('./imageGenerator');
const app = express()
const port = 3000

app.use(express.json())

const openai = new OpenAI();

app.post('/sitcom', async (req, res) => {
 
    const { settingPrompt, characters } = req.body
    const script = await scriptGenerator(openai, settingPrompt, characters);
    const parsedScript = scriptParser(script, characters);
    //parsedScript.background_url = await imageGenerator(openai, parsedScript.scene);
    res.send(parsedScript)
 
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

createSocketServer();