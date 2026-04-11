const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate image using OpenAI DALL-E 3
 * @param {string} prompt - Image description
 * @param {object} options - Generation options
 * @returns {Promise<string>} - Image URL
 */
const generateImageFromPrompt = async (prompt, options = {}) => {
  const {
    model = "dall-e-3",
    size = "1024x1024",
    quality = "standard",
    n = 1
  } = options;

  try {
    console.log('[OPENAI][IMAGE_GEN] Generating image with prompt:', prompt);
    
    const response = await openai.images.generate({
      model,
      prompt,
      n,
      size,
      quality
    });

    const imageUrl = response.data[0].url;
    console.log('[OPENAI][IMAGE_GEN] Success:', imageUrl);
    
    return imageUrl;
  } catch (err) {
    console.error('[OPENAI][IMAGE_GEN] Error:', err.message);
    throw new Error('Image generation failed: ' + err.message);
  }
};

module.exports = {
  generateImageFromPrompt
};
