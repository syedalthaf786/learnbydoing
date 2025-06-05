import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Divider,
  Container,
  Alert,
  Card,
  CardContent,
  LinearProgress,
  Button,
} from '@mui/material';
import {
  PlayCircleOutline,
  CheckCircle,
  RadioButtonUnchecked,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import Loading from '../Loading/Loading';

const fetchCourseContent = async (courseId) => {
  const API_URL = process.env.REACT_APP_API_URL || 'https://learnbydoing-1.onrender.com//api';
  const response = await fetch(`${API_URL}/courses/${courseId}/content`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to fetch course content');
  }
  return await response.json();
};

function CourseLearn() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModule, setSelectedModule] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState(0);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        const data = await fetchCourseContent(courseId);
        setCourse(data);

        // Set initial module and lesson
        if (data.content && data.content.length > 0) {
          const moduleIndex = data.content.findIndex((m) => !m.completed);
          if (moduleIndex !== -1 && data.content[moduleIndex].lessons.length > 0) {
            setSelectedModule(moduleIndex);
            const lessonIndex = data.content[moduleIndex].lessons.findIndex((l) => !l.completed);
            setSelectedLesson(lessonIndex !== -1 ? lessonIndex : 0);
          } else {
            setSelectedModule(0);
            setSelectedLesson(0);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load course content');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const handleLessonSelect = (moduleIndex, lessonIndex) => {
    setSelectedModule(moduleIndex);
    setSelectedLesson(lessonIndex);
  };

  const calculateProgress = () => {
    if (!course || !course.content) return 0;
    const totalLessons = course.content.reduce((sum, module) => sum + module.lessons.length, 0);
    const completedLessons = course.content.reduce(
      (sum, module) => sum + module.lessons.filter((lesson) => lesson.completed).length,
      0
    );
    return (completedLessons / totalLessons) * 100;
  };

  const handleCompleteCourse = () => {
    const progress = calculateProgress();

    if (progress < 100) {
      alert('Please complete all lessons to earn a certificate.');
      return;
    }

    const certifications = JSON.parse(localStorage.getItem('certifications')) || [];
    const isAlreadyCertified = certifications.some((cert) => cert.courseId === courseId);

    if (isAlreadyCertified) {
      alert('You have already earned a certificate for this course.');
      
      return;
    }

    const newCertification = {
      courseId: courseId,
      courseName: course.title,
      issueDate: new Date().toISOString(),
    };
    const updatedCertifications = [...certifications, newCertification];
    localStorage.setItem('certifications', JSON.stringify(updatedCertifications));

    alert('Congratulations! You have earned a certificate for this course.');
    Navigate("/certifications");
  };

  const navigateToNextLesson = () => {
    const currentModule = course.content[selectedModule];
    if (selectedLesson < currentModule.lessons.length - 1) {
      setSelectedLesson(selectedLesson + 1);
    } else if (selectedModule < course.content.length - 1) {
      setSelectedModule(selectedModule + 1);
      setSelectedLesson(0);
    }
  };

  const navigateToPreviousLesson = () => {
    if (selectedLesson > 0) {
      setSelectedLesson(selectedLesson - 1);
    } else if (selectedModule > 0) {
      const previousModule = course.content[selectedModule - 1];
      setSelectedModule(selectedModule - 1);
      setSelectedLesson(previousModule.lessons.length - 1);
    }
  };

  if (loading) {
    return <Loading message="Loading course content..." />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!course || !course.content || course.content.length === 0 || !course.content[selectedModule]?.lessons) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Course content not found</Alert>
      </Container>
    );
  }

  const currentModule = course.content[selectedModule];
  const currentLesson = currentModule.lessons[selectedLesson];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Sidebar: Course Progress and Content */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Course Progress
              </Typography>
              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={calculateProgress()}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {Math.round(calculateProgress())}% Complete
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={handleCompleteCourse}
                disabled={calculateProgress() < 100}
              >
                Complete Course & Get Certificate
              </Button>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Course Content
              </Typography>
              <List>
                {course.content.map((module, moduleIndex) => (
                  <React.Fragment key={module._id || moduleIndex}>
                    <ListItem>
                      <ListItemIcon>
                        {module.completed ? (
                          <CheckCircle color="success" />
                        ) : (
                          <RadioButtonUnchecked />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={module.title}
                        secondary={`${module.lessons.length} lessons`}
                      />
                    </ListItem>
                    <List component="div" disablePadding>
                      {module.lessons.map((lesson, lessonIndex) => (
                        <ListItemButton
                          key={lesson._id || lessonIndex}
                          selected={moduleIndex === selectedModule && lessonIndex === selectedLesson}
                          onClick={() => handleLessonSelect(moduleIndex, lessonIndex)}
                          sx={{ pl: 4 }}
                        >
                          <ListItemIcon>
                            {lesson.completed ? (
                              <CheckCircle color="success" fontSize="small" />
                            ) : (
                              <PlayCircleOutline fontSize="small" />
                            )}
                          </ListItemIcon>
                          <ListItemText primary={lesson.title} secondary={lesson.duration} />
                        </ListItemButton>
                      ))}
                    </List>
                    {moduleIndex < course.content.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content: Lesson Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              {currentLesson.title}
            </Typography>
            {/* Render each content block based on its type */}
            {currentLesson.contentBlocks &&
              currentLesson.contentBlocks.map((block, index) => {
                if (block.type === 'video') {
                  const embedUrl = block.content.includes('watch?v=')
                    ? block.content.replace('watch?v=', 'embed/')
                    : block.content;
                  return (
                    <Box key={index} sx={{ mb: 2 }}>
                      <iframe
                        width="100%"
                        height="315"
                        src={embedUrl}
                        title={`Video ${index}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </Box>
                  );
                } else if (block.type === 'code') {
                  return (
                    <Box
                      key={index}
                      sx={{
                        mb: 2,
                        p: 2,
                        backgroundColor: '#f4f4f4',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        borderRadius: 1,
                      }}
                    >
                      {block.content}
                    </Box>
                  );
                } else if (block.type === 'text') {
                  return (
                    <Typography key={index} variant="body1" paragraph>
                      {block.content}
                    </Typography>
                  );
                } else {
                  return null;
                }
              })}
            {/* Render assignments if available */}
            {currentLesson.assignments && currentLesson.assignments.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Assignments</Typography>
                <List>
                  {currentLesson.assignments.map((assignment, idx) => (
                    <ListItem key={idx}>
                      <ListItemText primary={assignment} />
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    Submit your assignment (GitHub URL):
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <input
                      type="url"
                      placeholder="Enter GitHub URL"
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                      }}
                      id="github-url-input"
                    />
                    <Button
                      variant="contained"
                      onClick={() => {
                        const input = document.getElementById('github-url-input');
                        const url = input.value;
                        const githubUrlPattern = /^https:\/\/github\.com\/.+/;
                        if (githubUrlPattern.test(url)) {
                          alert('Successfully sent assignment to your assigned mentor!');
                          input.value = '';
                          document.getElementById('next-lesson-btn').disabled = false;
                        } else {
                          alert('Please enter a valid GitHub URL.');
                        }
                      }}
                    >
                      Submit
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={navigateToPreviousLesson}
              disabled={selectedModule === 0 && selectedLesson === 0}
            >
              Previous Lesson
            </Button>
            <Button
              id="next-lesson-btn"
              endIcon={<ArrowForward />}
              onClick={navigateToNextLesson}
              disabled={
                selectedModule === course.content.length - 1 &&
                selectedLesson === currentModule.lessons.length - 1
              }
            >
              Next Lesson
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CourseLearn;