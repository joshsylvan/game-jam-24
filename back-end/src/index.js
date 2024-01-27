const express = require('express')
const OpenAI = require("openai");
const { createSocketServer } = require('./sockets')
var data = require('../../characters.json')
const app = express()
const port = 3000

app.use(express.json())

const openai = new OpenAI();

const thread = []

// app.post('/', async (req, res) => {

//   console.log(req.body.message)
//   try{
//     thread.push({ role: "user", content: req.body.message})
//     const completion = await openai.chat.completions.create({
//       messages: thread,
//       model: "gpt-4",
//     });
//     console.log(completion.choices[0].message.content)
//     thread.push(completion.choices[0].message)
//     res.send(thread)
//   }catch(error){
//     console.log(error)
//     return
//   }

// })

app.get('/sitcom', async (req, res) => {
  try {
    const prompt =
      `Write a short screenplay for a sitcom.
    The sitcom is about a group of friends who live in New York City.
    The characters are as follows:
    ${data.characters.map(character => `${character.name}: ${character.personality}`).join('\n')}`

    thread.push({ role: "user", content: prompt })
    const completion = await openai.chat.completions.create({
      messages: thread,
      model: "gpt-3.5-turbo",
    });
    console.log(completion.choices[0].message.content)
    thread.push(completion.choices[0].message)
    res.send(thread)
  } catch (error) {
    res.send(error)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

createSocketServer();