async function imageGenerator(openai, prompt) {
  console.log("--- Generating Image ---")

  const response = await openai.images.generate({
    model: "dall-e-2",
    prompt: `A cartoon background of ${prompt}.`,
    n: 1,
    size: "1024x1024",
  });
  return response.data[0].url
}

module.exports = imageGenerator;
