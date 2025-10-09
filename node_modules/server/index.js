require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();
const port = 3001;

// Connect to database
connectDB();

const messagesRouter = require('./routes/messages');
const authRouter = require('./routes/auth');
const conversationsRouter = require('./routes/conversations');
const workspacesRouter = require('./routes/workspaces');
const usersRouter = require('./routes/users');

app.use(cors());
app.use(express.json());
app.set('trust proxy', 1);

app.get('/', (req, res) => {
  res.send('Hello from server!');
});

app.get('/api/health', (req, res) => {
  res.sendStatus(200);
});

app.use('/api/messages', messagesRouter);
app.use('/api/auth', authRouter);
app.use('/api/conversations', conversationsRouter);
app.use('/api/workspaces', workspacesRouter);
app.use('/api/users', usersRouter);

module.exports = app;

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
