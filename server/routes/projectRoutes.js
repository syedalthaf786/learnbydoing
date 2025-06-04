const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  applyForRole,
  initializeVSCodeServer
} = require('../controllers/projectController');

// Project routes
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

// Project role application
router.post('/:projectId/apply', applyForRole);

// VS Code Server initialization
router.post('/:projectId/vscode', initializeVSCodeServer);

module.exports = router; 