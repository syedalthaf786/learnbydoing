const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, required: true, enum: ["Beginner", "Intermediate", "Advanced"] },
    category: { type: String, required: true },
    estimatedMonths: { type: Number, required: true },
    technologies: { type: [String], required: true },
    roles: [
      {
        title: { type: String, required: true },
        skills: { type: [String], required: true },
        responsibilities: { type: [String], required: true }
      }
    ],
    image: { type: String },
    githubUrl: { type: String },
    demoUrl: { type: String },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
