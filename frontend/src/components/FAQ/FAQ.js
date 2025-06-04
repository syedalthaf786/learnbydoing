import React from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  TextField,
  InputAdornment,
  Paper
} from '@mui/material';
import { ExpandMore, Search } from '@mui/icons-material';

const faqData = [
  {
    question: "How do I get started with learning?",
    answer: "Begin by creating an account and exploring our course catalog. Choose a course that interests you and click 'Start Learning' to begin your journey."
  },
  {
    question: "Are the courses self-paced?",
    answer: "Yes, all courses are self-paced. You can learn at your own speed and access the content anytime."
  },
  {
    question: "How do I track my progress?",
    answer: "Your progress is automatically tracked in your dashboard. You can view completed lessons, achievements, and overall course progress."
  },
  {
    question: "Can I access courses on mobile devices?",
    answer: "Yes, our platform is fully responsive and works on all devices including smartphones and tablets."
  },
  {
    question: "Do I get a certificate after completing a course?",
    answer: "Yes, you receive a certificate of completion after finishing all required modules of a course."
  },
  {
    question: "How can I participate in discussions?",
    answer: "Each course has a discussion section where you can interact with other learners and instructors."
  },
  {
    question: "What if I need help with a lesson?",
    answer: "You can ask questions in the course discussion forum or contact support for additional assistance."
  },
  {
    question: "How long do I have access to a course?",
    answer: "Once you start a course, you have unlimited access to its content."
  }
];

function FAQ() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, mb: 4, backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom align="center">
          Frequently Asked Questions
        </Typography>
        <Typography align="center">
          Find answers to common questions about our learning platform
        </Typography>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {filteredFAQs.length === 0 ? (
        <Typography color="text.secondary" align="center">
          No matching questions found. Try a different search term.
        </Typography>
      ) : (
        filteredFAQs.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls={`panel${index}bh-content`}
              id={`panel${index}bh-header`}
            >
              <Typography sx={{ fontWeight: 500 }}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Container>
  );
}

export default FAQ;