const express = require("express");
const OpenAI = require("openai");
const { createSocketServer } = require("./sockets");
const scriptGenerator = require("./scriptGenerator");
const scriptParser = require("./scriptParser");
const imageGenerator = require("./imageGenerator");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

const openai = new OpenAI();

const io = createSocketServer();

app.post("/sitcom", async (req, res) => {
  try {
    const { settingPrompt, characters } = req.body;
    const script = await scriptGenerator(openai, settingPrompt, characters);
    const parsedScript = scriptParser(script, characters);
    parsedScript.background_url = await imageGenerator(
      openai,
      `A video game background for the following scene: ${parsedScript.scene}.`
    );
    parsedScript.characters = [];
    for (const character of characters) {
      const image_url = await imageGenerator(
        openai,
        `A head shot photo of ${character.name} who ${character.personality}. In the following scene: ${parsedScript.scene}`,
        false
      );
      parsedScript.characters.push({ ...character, image_url });
    }
    res.send(parsedScript);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
