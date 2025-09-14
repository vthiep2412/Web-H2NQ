
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

app.use('/api/messages', messagesRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
