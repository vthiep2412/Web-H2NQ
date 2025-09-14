const messages = [
  { id: 1, text: 'Hi, how can I help you?', sender: 'ai' },
];

exports.getMessages = (req, res) => {
  res.json(messages);
};
