const model = require('../config/gemini');

const simplifyText = async (req, res) => {
  try {
    const { image, language } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const prompt = language === 'hi'
  ? `Read the text in this image and explain it simply in Hinglish (Hindi written in English letters). Use short sentences and simple words.`
  : `Read the text in this image and simplify it to a 5th grade reading level. Use short sentences. Replace technical or legal jargon with simple words.`;

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
    console.error('Simplify error:', error);
    res.status(500).json({ error: 'Failed to simplify text' });
  }
};

module.exports = { simplifyText };