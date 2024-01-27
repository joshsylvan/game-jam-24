const express = require('express')
const OpenAI = require("openai");
const { createSocketServer } = require('./sockets')
const scriptParser = require('./scriptParser');
const app = express()
const port = 3000

app.use(express.json())

const openai = new OpenAI();

app.post('/sitcom', async (req, res) => {
  try{
    const { settingPrompt, characters } = req.body
    const prompt = 
    `Write a short screenplay for a sitcom.
The sitcom is set at ${settingPrompt}.
With only the following characters:
${characters.map(character => `${character.name}: ${character.personality}`).join('\n')}`
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt}],
      model: "gpt-3.5-turbo",
    });
    const script = scriptParser(completion.choices[0].message.content, characters)
    res.send(script)
  } catch (error) {
    res.send(error)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

createSocketServer();