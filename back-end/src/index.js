const express = require('express')
const OpenAI = require("openai");
const { createSocketServer } = require('./sockets')
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
The characters are as follows:
${characters.map(character => `${character.name}: ${character.personality}`).join('\n')}`

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt}],
      model: "gpt-3.5-turbo",
    });

    console.log(completion.choices[0].message.content)
    res.send(completion.choices[0].message)
  } catch (error) {
    res.send(error)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

createSocketServer();