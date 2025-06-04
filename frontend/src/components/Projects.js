// import React from 'react';
// import { Container, Grid, Card, CardContent, Typography, Button, Chip } from '@mui/material';

// function Projects() {
//   const projects = [
//     {
//       id: 1,
//       title: 'E-commerce Platform',
//       description: 'Build a full-featured e-commerce platform',
//       difficulty: 'Intermediate',
//       technologies: ['React', 'Node.js', 'MongoDB']
//     },
//     {
//       id: 2,
//       title: 'Social Media Dashboard',
//       description: 'Create a social media analytics dashboard',
//       difficulty: 'Advanced',
//       technologies: ['React', 'Firebase', 'D3.js']
//     }
//   ];

//   return (
//     <Container sx={{ py: 4 }}>
//       <Typography variant="h4" gutterBottom>Real-Time Projects</Typography>
//       <Grid container spacing={4}>
//         {projects.map((project) => (
//           <Grid item key={project.id} xs={12} md={6}>
//             <Card>
//               <CardContent>
//                 <Typography gutterBottom variant="h5" component="div">
//                   {project.title}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" paragraph>
//                   {project.description}
//                 </Typography>
//                 <Typography variant="body2">
//                   Difficulty: {project.difficulty}
//                 </Typography>
//                 <div style={{ marginTop: 10 }}>
//                   {project.technologies.map((tech) => (
//                     <Chip key={tech} label={tech} sx={{ mr: 1, mb: 1 }} />
//                   ))}
//                 </div>
//                 <Button variant="contained" sx={{ mt: 2 }}>
//                   Start Project
//                 </Button>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// }

// export default Projects;