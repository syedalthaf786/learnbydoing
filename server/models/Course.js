const mongoose = require('mongoose');
const { Schema } = mongoose;

const contentBlockSchema = new Schema({
  type: {
    type: String,
    enum: ['text', 'video', 'code'],
    required: true,
  },
  content: { type: String, default: '' }
});

const lessonSchema = new Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  completed: { type: Boolean, default: false },
  // Replace the simple content field with an array of content blocks
  contentBlocks: [contentBlockSchema],
  assignments: [{ type: String }]
});

const moduleSchema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  lessons: [lessonSchema]
});

const curriculumSectionSchema = new Schema({
  title: { type: String, required: true },
  lessons: [{ type: String }]
});

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    duration: { type: String },
    level: { type: String },
    students: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    instructor: { type: String },
    // Details for CourseDetail component
    objectives: [{ type: String }],
    curriculum: [curriculumSectionSchema],
    // Content for CourseLearn component: now with modules that hold lessons with content blocks
    content: [moduleSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);