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
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const mockSessions = [
  {
    id: 1,
    student: 'John Doe',
    date: '2024-03-25',
    time: '10:00 AM',
    duration: '60',
    status: 'scheduled',
  },
  {
    id: 2,
    student: 'Jane Smith',
    date: '2024-03-26',
    time: '2:00 PM',
    duration: '45',
    status: 'completed',
  },
];

const SessionManagement = () => {
  const [sessions] = useState(mockSessions);

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Session Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          New Session
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Duration (min)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{session.student}</TableCell>
                <TableCell>{session.date}</TableCell>
                <TableCell>{session.time}</TableCell>
                <TableCell>{session.duration}</TableCell>
                <TableCell>
                  <Chip
                    label={session.status}
                    color={getStatusColor(session.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" title="Edit Session">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" title="Delete Session">
                    <DeleteIcon />
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

export default SessionManagement; 