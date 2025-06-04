import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { ProjectProvider } from './context/ProjectContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import BackToTop from './components/BackToTop/BackToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer/Footer';
import Loading from './components/Loading/Loading';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import CourseManagement from './components/admin/CourseManagement';
import ProjectManagement from './components/admin/ProjectManagement';
import UserManagement from './components/admin/UserManagement';
import MentorManagement from './components/admin/MentorManagement';
import MentorLayout from './components/mentor/MentorLayout';
import MentorDashboard from './components/mentor/MentorDashboard';
import StudentManagement from './components/mentor/StudentManagement';
import SessionManagement from './components/mentor/SessionManagement';
// import AdminPanel from './components/admin/AdminPanel';
import AdminDashboard from './components/admin/AdminDashboard';
import AssignmentManagement from './components/admin/AssignmentManagement';
// import Reports from './components/admin/Reports';
import Settings from './components/Settings/Settings';
import UserDashboard from './components/Dashboard';
import LoadingScreen from './components/LoadingScreen';
import EnrolledCourses from './components/Courses/EnrolledCourses';
import Certifications from './components/Courses/Certifications';

// Lazy load components
const Home = lazy(() => import('./components/Home'));
const Login = lazy(() => import('./components/Auth/Login'));
const Register = lazy(() => import('./components/Auth/Register'));
const Courses = lazy(() => import('./components/Courses/Courses'));
const CourseDetail = lazy(() => import('./components/Courses/CourseDetail'));
const CourseLearn = lazy(() => import('./components/Courses/CourseLearn'));
const Projects = lazy(() => import('./components/Projects/Projects'));
const ProjectDetail = lazy(() => import('./components/Projects/ProjectDetail')); 
const Profile = lazy(() => import('./components/Profile/Profile'));
const Progress = lazy(() => import('./components/Progress/Progress'));
const Discussion = lazy(() => import('./components/Discussion/Discussion'));
const Search = lazy(() => import('./components/Search/Search'));
const FAQ = lazy(() => import('./components/FAQ/FAQ'));
const About = lazy(() => import('./components/About/About'));
const Contact = lazy(() => import('./components/Contact/Contact'));
const Notifications = lazy(() => import('./components/Notifications/Notifications'));
const NotFound = lazy(() => import('./components/NotFound/NotFound'));
const ForgotPassword = lazy(() => import('./components/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/Auth/ResetPassword'));
const ProjectList = lazy(() => import('./components/Projects/ProjectList'));
const WorkSpace = lazy(( ) => import('./components/Projects/WorkSpace')); 
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#2563EB',
      light: '#3B82F6',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF'
    },
    accent: {
      main: '#8B5CF6',
      light: '#A78BFA',
      dark: '#7C3AED'
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669'
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626'
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706'
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB'
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
      gradient: 'linear-gradient(135deg, #10B981 0%, #2563EB 100%)'
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B'
    }
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      background: 'linear-gradient(135deg, #10B981 0%, #2563EB 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    h2: {
      fontWeight: 600,
      color: '#10B981'
    },
    h3: {
      fontWeight: 600,
      color: '#2563EB'
    },
    h4: {
      fontWeight: 600,
      color: '#1E293B'
    },
    h5: {
      fontWeight: 600,
      color: '#1E293B'
    },
    h6: {
      fontWeight: 600,
      color: '#1E293B'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(16, 185, 129, 0.15)'
          }
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)'
          }
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #10B981 0%, #2563EB 100%)',
          boxShadow: '0 2px 10px rgba(16, 185, 129, 0.1)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 30px rgba(16, 185, 129, 0.12)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover fieldset': {
              borderColor: '#10B981'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2563EB'
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontWeight: 500
        }
      }
    },
    // Removed invalid main.MuiBox key
  },
  shape: {
    borderRadius: 8
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(16, 185, 129, 0.05)',
    '0px 4px 8px rgba(16, 185, 129, 0.08)',
    '0px 8px 16px rgba(16, 185, 129, 0.1)',
    '0px 12px 24px rgba(16, 185, 129, 0.12)',
    '0px 16px 32px rgba(16, 185, 129, 0.15)',
    ...Array(19).fill('none')
  ]
});

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
     <ScrollToTop />
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/not-found" element={<NotFound />} />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="Admindash" element={<AdminDashboard/>} />
                <Route path="users" element={<UserManagement />} />
                <Route path="courses" element={<CourseManagement />} />
                <Route path="assignments" element={<AssignmentManagement />} />
                <Route path="projects" element={<ProjectManagement />} />
                {/* <Route path="panel" element={<AdminPanel />} /> */}
              </Route>

              {/* Mentor Routes */}
              <Route
                path="/mentor/*"
                element={
                  <ProtectedRoute allowedRoles={['mentor']}>
                    <MentorLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<MentorDashboard />} />
                <Route path="Mentordash" element={<MentorDashboard />} />
                <Route path="students" element={<StudentManagement />} />
                <Route path="sessions" element={<SessionManagement />} />
              </Route>

              {/* User Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <ProjectList />
                  </ProtectedRoute>
                }
              />
              <Route path="/projects/:projectId"
               element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
                } />
                
              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <Courses />
                  </ProtectedRoute>
                }
              />
              <Route path="/courses/:courseId"
               element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
               
               } />
               <Route path="/courses/:courseId/learn"
                element={
                  <ProtectedRoute>
                    <CourseLearn />
                  </ProtectedRoute>
                } />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="/progress"
               element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
                } />
              <Route path="/discussion"
               element={
                <ProtectedRoute>
                  <Discussion />
                </ProtectedRoute>
                } />
              <Route path="/search"
               element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
                } />
              <Route path="/settings"
               element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
                } />
              <Route path="/notifications"
               element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
                } />
              <Route path="/not-found"
               element={
                <ProtectedRoute>
                  <NotFound />
                </ProtectedRoute>
                } />
              <Route path="/about"
               element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
                } />
              <Route path="/contact"
               element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
                } />
              <Route path="/faq"
               element={
                <ProtectedRoute>
                  <FAQ />
                </ProtectedRoute>
                } />
                <Route path="/workspace/:projectId"
                 element={
                  <ProtectedRoute>
                    <WorkSpace />
                  </ProtectedRoute>
                  } />
                <Route path="/enrolled-courses" element={<EnrolledCourses />} />
                <Route path="/certifications" element={<Certifications />} />

                

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Box>
      <BackToTop />
      <Footer />
    </Box>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <CustomThemeProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <ProjectProvider>
                <AppContent />
              </ProjectProvider>
            </ThemeProvider>
          </CustomThemeProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
  
}

export default App;