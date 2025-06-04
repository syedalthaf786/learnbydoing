import React from 'react';
import { 
  Box, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Stack 
} from '@mui/material';

function ProjectFilters({ search, category, status, setSearch, setCategory, setStatus }) {
  const categories = [
    "All",
    "Web Development",
    "Mobile Development",
    "AI/ML",
    "Data Science",
    "Blockchain",
    "IoT"
  ];

  const statuses = ["All", "Completed", "In Progress"];

  return (
    <Stack 
      direction={{ xs: 'column', sm: 'row' }} 
      spacing={2} 
      sx={{ mb: 4 }}
    >
      <TextField
        fullWidth
        label="Search Projects"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        variant="outlined"
        size="small"
      />
      <FormControl sx={{ minWidth: 200 }} size="small">
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          label="Category"
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 150 }} size="small">
        <InputLabel>Status</InputLabel>
        <Select
          value={status}
          label="Status"
          onChange={(e) => setStatus(e.target.value)}
        >
          {statuses.map((stat) => (
            <MenuItem key={stat} value={stat}>{stat}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}

export default ProjectFilters;