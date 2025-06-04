// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   Grid,
//   Typography,
//   Alert,
//   TextField,
//   InputAdornment,
//   Card,
//   CardContent,
//   CardMedia,
//   Button,
//   Box,
//   Chip,
//   Rating
// } from '@mui/material';
// import { Search, Timer, People } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import useApi from '../hooks/useApi';
// import useInfiniteScroll from '../hooks/useInfiniteScroll';
// import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
// import useLocalStorage from '../hooks/useLocalStorage';
// import Loading from './Loading/Loading';

// const fetchCourses = async (page) => {
//   await new Promise(resolve => setTimeout(resolve, 1500));
//   const itemsPerPage = 6;
//   const allCourses = [
//     {
//       id: 1,
//       title: 'Web Development Fundamentals',
//       description: 'Learn the basics of web development including HTML, CSS, and JavaScript.',
//       image: '/images/web-dev.jpg',
//       duration: '8 weeks',
//       level: 'Beginner',
//       students: 1234,
//       rating: 4.5,
//       instructor: 'John Doe'
//     },
//     {
//       id: 2,
//       title: 'React.js Advanced Concepts',
//       description: 'Master advanced React concepts including hooks, context, and Redux.',
//       image: '/images/react.jpg',
//       duration: '10 weeks',
//       level: 'Advanced',
//       students: 856,
//       rating: 4.8,
//       instructor: 'Jane Smith'
//     },
//     {
//       id: 3,
//       title: 'Full Stack Development',
//       description: 'Build complete web applications with MERN stack.',
//       image: '/images/fullstack.jpg',
//       duration: '12 weeks',
//       level: 'Intermediate',
//       students: 967,
//       rating: 4.6,
//       instructor: 'Mike Johnson'
//     },
//     {
//       id: 4,
//       title: 'Mobile App Development',
//       description: 'Learn to build mobile apps with React Native.',
//       image: '/images/mobile-dev.jpg',
//       duration: '10 weeks',
//       level: 'Intermediate',
//       students: 745,
//       rating: 4.7,
//       instructor: 'Sarah Wilson'
//     },
//     {
//       id: 5,
//       title: 'UI/UX Design Principles',
//       description: 'Master the fundamentals of user interface and experience design.',
//       image: '/images/ui-ux.jpg',
//       duration: '6 weeks',
//       level: 'Beginner',
//       students: 1123,
//       rating: 4.9,
//       instructor: 'David Chen'
//     }
//   ];

//   const start = (page - 1) * itemsPerPage;
//   const end = start + itemsPerPage;
//   const paginatedCourses = allCourses.slice(start, end);

//   return {
//     courses: paginatedCourses,
//     hasMore: end < allCourses.length
//   };
// };

// function CourseCard({ course, onClick }) {
//   const navigate = useNavigate();

//   const handleClick = (e) => {
//     if (onClick) {
//       onClick(e);
//     } else {
//       navigate(`/courses/${course.id}`);
//     }
//   };

//   return (
//     <Card 
//       sx={{ 
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         transition: '0.3s',
//         '&:hover': {
//           transform: 'translateY(-4px)',
//           boxShadow: 4
//         },
//         cursor: 'pointer'
//       }}
//       onClick={handleClick}
//     >
//       <CardMedia
//         component="img"
//         height="200"
//         image={course.image}
//         alt={course.title}
//       />
//       <CardContent sx={{ flexGrow: 1 }}>
//         <Typography gutterBottom variant="h5" component="h2">
//           {course.title}
//         </Typography>
//         <Typography color="text.secondary" paragraph>
//           {course.description}
//         </Typography>
        
//         <Box sx={{ mb: 2 }}>
//           <Typography variant="subtitle2" color="text.secondary">
//             Instructor: {course.instructor}
//           </Typography>
//         </Box>

//         <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
//           <Chip 
//             icon={<Timer />} 
//             label={course.duration} 
//             variant="outlined" 
//             size="small"
//           />
//           <Chip 
//             label={course.level} 
//             variant="outlined" 
//             size="small"
//           />
//           <Chip 
//             icon={<People />} 
//             label={`${course.students} students`} 
//             variant="outlined" 
//             size="small"
//           />
//         </Box>

//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//           <Rating 
//             value={course.rating} 
//             precision={0.1} 
//             readOnly 
//             size="small"
//           />
//           <Typography variant="body2" sx={{ ml: 1 }}>
//             ({course.rating})
//           </Typography>
//         </Box>

//         <Button 
//           variant="contained" 
//           fullWidth
//           onClick={(e) => {
//             e.stopPropagation();
//             handleClick(e);
//           }}
//         >
//           View Course
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }

// function Courses() {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useLocalStorage('courseSearch', '', {
//     expiry: 24 * 60 * 60 * 1000
//   });

//   const [viewPreferences, setViewPreferences] = useLocalStorage('courseViewPrefs', {
//     itemsPerPage: 6,
//     view: 'grid'
//   });

//   const [recentCourses, setRecentCourses] = useLocalStorage('recentCourses', [], {
//     expiry: 7 * 24 * 60 * 60 * 1000
//   });

//   const [courses, setCourses] = useState([]);

//   const {
//     loading,
//     error,
//     hasMore,
//     reset: resetScroll
//   } = useInfiniteScroll(async (page) => {
//     const result = await fetchCourses(page);
//     setCourses(prev => [...prev, ...result.courses]);
//     return { hasMore: result.hasMore };
//   }, { threshold: 200 });

//   useKeyboardShortcut({
//     'ctrl+k': () => document.querySelector('input[type="text"]').focus(),
//     'ctrl+n': () => navigate('/courses/new'),
//     'esc': () => setSearchTerm(''),
//     'ctrl+h': () => navigate('/')
//   });

//   const handleCourseClick = (course) => {
//     setRecentCourses(prev => {
//       const filtered = prev.filter(c => c.id !== course.id);
//       return [course, ...filtered].slice(0, 5);
//     });
//     navigate(`/courses/${course.id}`);
//   };

//   useEffect(() => {
//     setCourses([]);
//     resetScroll();
//   }, [searchTerm, resetScroll]);

//   const filteredCourses = courses.filter(course =>
//     course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     course.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Available Courses
//       </Typography>

//       <TextField
//         fullWidth
//         variant="outlined"
//         placeholder="Search courses... (Ctrl+K)"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         sx={{ mb: 4 }}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <Search />
//             </InputAdornment>
//           ),
//         }}
//       />

//       {recentCourses.length > 0 && (
//         <Box sx={{ mb: 4 }}>
//           <Typography variant="h6" gutterBottom>
//             Recently Viewed
//           </Typography>
//           <Grid container spacing={3}>
//             {recentCourses.map((course) => (
//               <Grid item xs={12} md={4} key={course.id}>
//                 <CourseCard 
//                   course={course} 
//                   onClick={() => handleCourseClick(course)}
//                 />
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       )}

//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         {filteredCourses.map((course) => (
//           <Grid item xs={12} md={4} key={course.id}>
//             <CourseCard 
//               course={course}
//               onClick={() => handleCourseClick(course)}
//             />
//           </Grid>
//         ))}
//       </Grid>

//       {loading && (
//         <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
//           <Loading message="Loading more courses..." />
//         </Box>
//       )}

//       {error && (
//         <Alert severity="error" sx={{ mt: 2 }}>
//           {error}
//         </Alert>
//       )}

//       {!hasMore && courses.length > 0 && (
//         <Typography 
//           align="center" 
//           color="text.secondary"
//           sx={{ mt: 4 }}
//         >
//           No more courses to load
//         </Typography>
//       )}
//     </Container>
//   );
// }

// export default Courses;