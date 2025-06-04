import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { getAssessment, evaluateAssessment } from '../../services/assessmentService';
import { useNavigate } from 'react-router-dom';
function Assessment({ open, onClose, role, onComplete, projectId, projectTitle }) {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!role) return;

      try {
        setLoading(true);
        const data = await getAssessment(role.title);
        setAssessment(data);
        setAnswers({});
        setCurrentQuestionIndex(0);
      } catch (error) {
        console.error('Failed to fetch assessment:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open && role) {
      fetchAssessment();
    }
  }, [role, open]);

  useEffect(() => {
    if (!open) {
      setAnswers({});
      setResult(null);
      setLoading(true);
      setCurrentQuestionIndex(0);
    }
  }, [open]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: parseInt(value, 10)
    }));
  };

  const storeCompletedProject = () => {
    const completedProjects = JSON.parse(localStorage.getItem('completedProjects')) || [];
    
    // Check if project is already stored
    if (!completedProjects.some(p => p._id === projectId)) {
      completedProjects.push({
        _id: projectId,
        title: projectTitle,
        role: role.title,
        completedAt: new Date().toISOString(),
        status: 'completed'
      });
      
      localStorage.setItem('completedProjects', JSON.stringify(completedProjects));
      console.log('Project stored:', completedProjects);
    }
  };

  const handleSubmit = async () => {
    if (!role) return;

    setSubmitting(true);
    try {
      const evaluationResult = await evaluateAssessment(role.title, answers);
      setResult(evaluationResult);
      if (evaluationResult.passed) {
        storeCompletedProject();
        onComplete(evaluationResult);
      }
          } catch (error) {
      console.error('Failed to evaluate assessment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!role) {
    return null;
  }

  if (loading) {
    return (
      <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  const questions = assessment?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assessment for {role.title}</DialogTitle>
      <DialogContent>
        {result ? (
          <Box sx={{ py: 2 }}>
            <Alert severity={result.passed ? "success" : "error"} sx={{ mb: 2 }}>
              {result.feedback}
            </Alert>
            <Typography variant="h6" gutterBottom>
              Your Score: {result.score}%
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" paragraph>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                {currentQuestion.question}
              </Typography>
              <RadioGroup
                value={answers[currentQuestion.id] ?? ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              >
                {currentQuestion.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index.toString()}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {result ? 'Close' : 'Cancel'}
        </Button>
        {!result && (
          <>
            <Button
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                disabled={answers[currentQuestion.id] === undefined}
                variant="contained"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={submitting || Object.keys(answers).length !== questions.length}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default Assessment;
