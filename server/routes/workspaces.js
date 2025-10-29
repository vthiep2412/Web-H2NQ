// Happy coding :D!
// Happy coding :D
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const workspaceController = require('../controllers/workspaces');

// @route   GET api/workspaces
// @desc    Get all workspaces for a user
// @access  Private
router.get('/', auth, workspaceController.getWorkspaces);

// @route   POST api/workspaces
// @desc    Create a new workspace
// @access  Private
router.post('/', auth, workspaceController.createWorkspace);

// @route   PUT api/workspaces/:id
// @desc    Update a workspace
// @access  Private
router.put('/:id', auth, workspaceController.updateWorkspace);

// @route   DELETE api/workspaces/:id
// @desc    Delete a workspace
// @access  Private
router.delete('/:id', auth, workspaceController.deleteWorkspace);

module.exports = router;
