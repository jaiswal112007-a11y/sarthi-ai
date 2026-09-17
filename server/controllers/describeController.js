const model = require('../config/gemini');

const describeScene = async (req, res) => {
  try {
    const { image, language } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const prompt = language === 'hi'
  ? `You are helping a visually impaired person. Describe what you see in this image in Hinglish (Hindi written in English letters, like "Aapke saamne ek sofa hai"). Keep it 2-3 sentences. Focus on objects, their position like left right ahead, and any obstacles or people.`
  : `You are helping a visually impaired person understand their surroundings. Describe what you see in this image in 2-3 simple sentences. Focus on: objects and their position (left, right, ahead), any obstacles on the floor, any exits or doors, and any people. Be concise and directional.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: image
        }
      }
    ]);

    const text = result.response.text();
    res.json({ description: text });

  } catch (error) {
    console.error('Describe error:', error);
    res.status(500).json({ error: 'Failed to describe scene' });
  }
};

module.exports = { describeScene };