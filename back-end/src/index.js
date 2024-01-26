const express = require('express')
const OpenAI = require ("openai");
const app = express()
const port = 3000

app.use(express.json())

const openai = new OpenAI();

const thread = []

app.post('/', async (req, res) => {

  console.log(req.body.message)
  try{
    thread.push({ role: "user", content: req.body.message})
    const completion = await openai.chat.completions.create({
      messages: thread,
      model: "gpt-4",
    });
    console.log(completion.choices[0].message.content)
    thread.push(completion.choices[0].message)
    res.send(thread)
  }catch(error){
    console.log(error)
    return
  }

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})