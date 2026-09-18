const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.options('*', cors());

app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'SarthiAI backend is running' });
});

app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', message: 'SarthiAI server is running' });
});

const describeRoute = require('./routes/describe');
const documentRoute = require('./routes/document');
const simplifyRoute = require('./routes/simplify');

app.use('/api/describe', describeRoute);
app.use('/api/document', documentRoute);
app.use('/api/simplify', simplifyRoute);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});