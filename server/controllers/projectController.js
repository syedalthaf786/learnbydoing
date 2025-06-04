const Project = require("../models/projectModel");
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { startCodeServer } = require('./codeServerIntegration');

// Helper function to validate ObjectId format
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id.trim());

// Get all projects
const getProjects = async (req, res) => {
  console.log("GET /api/projects called");
  try {
    const projects = await Project.find();
    console.log("Projects retrieved:", projects);
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get a single project by ID
const getProjectById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid project ID format" });
  }

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project", error: error.message });
  }
};

// Create a new project
const applyForRole = async (req, res) => {
  console.log("Received request:", req.params, req.body);
  
  const { projectId } = req.params;  // Incorrect! Should be 'id' instead of 'projectId'
  const { role, application } = req.body;

  if (!role || !application) {
    return res.status(400).json({ message: "Role and application text are required." });
  }

  try {
    console.log(`Application received for project ${projectId}:`, { role, application });
    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.error("Error applying for role:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//   try {
//     let {
//       title,
//       description,
//       difficulty,
//       category,
//       estimatedMonths,
//       technologies,
//       roles,
//       image,
//       githubUrl,
//       demoUrl,
//       completed,
//     } = req.body;

//     // Validate required fields
//     if (!title || !description || !difficulty || !category || !estimatedMonths || !technologies || !roles) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Ensure technologies is an array
//     if (typeof technologies === "string") {
//       technologies = technologies.split(",").map((tech) => tech.trim());
//     }

//     // Parse roles into an array of objects if it's a JSON string
//     if (typeof roles === "string") {
//       try {
//         roles = JSON.parse(roles);
//       } catch (error) {
//         return res.status(400).json({ message: "Invalid roles format. Expected JSON array." });
//       }
//     }

//     const project = new Project({
//       title: title.trim(),
//       description: description.trim(),
//       difficulty,
//       category: category.trim(),
//       estimatedMonths: Number(estimatedMonths),
//       technologies,
//       roles,
//       image: image ? image.trim() : null,
//       githubUrl: githubUrl ? githubUrl.trim() : null,
//       demoUrl: demoUrl ? demoUrl.trim() : null,
//       completed: completed || false,
//     });

//     const savedProject = await project.save();
//     res.status(201).json(savedProject);
//   } catch (error) {
//     res.status(400).json({ message: "Invalid project data", error: error.message });
//   }
// };
const createProject = async (req, res) => {
  try {
    console.log("Received POST request to /api/projects");
    console.log("Request body:", req.body);

    if (!req.body.title || !req.body.description) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    const project = new Project(req.body);
    const savedProject = await project.save();

    console.log("Project created:", savedProject);
    res.status(201).json(savedProject);
  } catch (error) {
    console.error("Error in createProject:", error.message);
    res.status(400).json({ message: "Invalid project data", error: error.message });
  }
};


// Update a project
const updateProject = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid project ID format" });
  }

  try {
    const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error: error.message });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid project ID format" });
  }

  try {
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error: error.message });
  }
};

const initializeVSCodeServer = async (req, res) => {
  try {
    // Start code-server as a child process.
    const codeServerProcess = startCodeServer();

    // Respond to client (you might need additional logic to ensure code-server is ready)
    res.json({
      message: "VS Code Server is running",
      url: "http://localhost:8081"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// router.post('/api/projects/:projectId/vscode', initializeVSCodeServer);

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject, applyForRole, initializeVSCodeServer };
