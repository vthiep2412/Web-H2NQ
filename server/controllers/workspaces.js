// Happy coding :D!
// Happy coding :D
const Workspace = require('../models/Workspace');
const User = require('../models/User');
const Conversation = require('../models/Conversation');

exports.getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(workspaces);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createWorkspace = async (req, res) => {
  const { name, memories } = req.body;
  const userId = req.user.id;
  console.log(`createWorkspace called for userId: ${userId} with name: ${name}`);

  try {
    const user = await User.findById(userId);
    const workspaceCount = await Workspace.countDocuments({ userId });

    if (user.tier === 'free' && workspaceCount >= 2) {
      return res.status(403).json({ msg: 'You have reached the maximum of 2 workspaces for your free tier.' });
    }

    const existingWorkspace = await Workspace.findOne({ userId, name });
    if (existingWorkspace) {
      return res.status(400).json({ msg: 'Workspace with this name already exists' });
    }

    const newWorkspace = new Workspace({
      userId,
      name: name || 'New Workspace',
      memories: memories || [],
    });

    const workspace = await newWorkspace.save();
    console.log(`Workspace created: ${workspace.name} (${workspace._id}) for userId: ${userId}`);
    res.json(workspace);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateWorkspace = async (req, res) => {
  const { name, memories } = req.body;

  try {
    let workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ msg: 'Workspace not found' });
    }

    if (workspace.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    workspace.name = name || workspace.name;
    workspace.memories = memories || workspace.memories;
    workspace.updatedAt = Date.now();

    workspace = await workspace.save();
    res.json(workspace);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ msg: 'Workspace not found' });
    }

    if (workspace.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await workspace.deleteOne();
    await Conversation.deleteMany({ workspaceId: req.params.id });

    res.json({ msg: 'Workspace removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
