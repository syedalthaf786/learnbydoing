import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Message as MessageIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

const mockStudents = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    progress: 75,
    status: 'active',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    progress: 45,
    status: 'inactive',
  },
];

const StudentManagement = () => {
  const [students] = useState(mockStudents);

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Student Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.progress}%</TableCell>
                <TableCell>
                  <Chip
                    label={student.status}
                    color={getStatusColor(student.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" title="Send Message">
                    <MessageIcon />
                  </IconButton>
                  <IconButton color="secondary" title="View Progress">
                    <AssessmentIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StudentManagement; 