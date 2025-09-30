require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

const messagesRouter = require('./routes/messages');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from server!');
});

app.get('/api/health', (req, res) => {
  res.sendStatus(200);
});

app.use('/api/messages', messagesRouter);

module.exports = app;

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
