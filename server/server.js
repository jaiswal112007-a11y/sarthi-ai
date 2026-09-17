const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', message: 'VoiceEyes server is running' });
});

// Routes
const describeRoute = require('./routes/describe');
const documentRoute = require('./routes/document');
const simplifyRoute = require('./routes/simplify');

app.use('/api/describe', describeRoute);
app.use('/api/document', documentRoute);
app.use('/api/simplify', simplifyRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});