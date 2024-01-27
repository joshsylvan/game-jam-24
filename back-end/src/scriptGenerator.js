async function scriptGenerator(openai, settingPrompt, characters) {
  console.log("--- Generating Script ---")

  const prompt = `Write a short screenplay for a sitcom.
The sitcom is set at ${settingPrompt}.
With only the following characters:
${characters.map(character => `${character.name}: ${character.personality}`).join('\n')}`

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt}],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content;
}

module.exports = scriptGenerator;