async function imageGenerator(openai, prompt, highQuality = true) {
  console.log("--- Generating Image ---");

  const response = await openai.images.generate({
    model: "dall-e-2",
    prompt: prompt,
    n: 1,
    size: highQuality ? "1024x1024" : "256x256",
  });
  return response.data[0].url;
}

module.exports = imageGenerator;
