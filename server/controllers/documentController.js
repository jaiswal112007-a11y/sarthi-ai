const model = require('../config/gemini');

const readDocument = async (req, res) => {
  try {
    const { image, language } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const prompt = language === 'hi'
  ? `Read all text visible in this image and respond in Hinglish (Hindi written in English letters). Read everything clearly in natural order.`
  : `Extract and read all text visible in this image exactly as written. Maintain the natural reading order. Read everything clearly.`;

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
    console.error('Document error:', error);
    res.status(500).json({ error: 'Failed to read document' });
  }
};

module.exports = { readDocument };