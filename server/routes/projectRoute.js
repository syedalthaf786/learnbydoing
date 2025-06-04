const express = require("express");
const { applyForRole } = require("../controllers/projectController");

const { 
  getProjects, 
  getProjectById,  
  createProject, 
  updateProject, 
  deleteProject,
  initializeVSCodeServer 
} = require("../controllers/projectController");

const router = express.Router();

router.post("/test-apply", (req, res) => {
  console.log("Test apply route hit:", req.body);
  res.status(200).json({ message: "Test apply route works!" });
});

router.get("/test", (req, res) => {
  res.json({ success: true, message: "Project route works!" });
});

router.route("/")
  .get(getProjects)
  .post(createProject);

router.route("/:id")
  .post(applyForRole)
  .get(getProjectById)
  .patch(updateProject)
  .delete(deleteProject);
  router.post("/:id/apply", applyForRole);

// VS Code Server routes
router.post('/:projectId/vscode', initializeVSCodeServer);

module.exports = router;
