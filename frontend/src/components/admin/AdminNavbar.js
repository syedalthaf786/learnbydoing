import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  School,
  Assignment,
  Settings,
  Logout,
} from '@mui/icons-material';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AdminNavbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Redirect non-admin users
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    handleMenuClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onToggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
          <Button
            color="inherit"
            startIcon={<Dashboard />}
            onClick={() => handleNavigation('/admin/Admindash')}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            startIcon={<People />}
            onClick={() => handleNavigation('/admin/users')}
          >
            Users
          </Button>
          <Button
            color="inherit"
            startIcon={<School />}
            onClick={() => handleNavigation('/admin/courses')}
          >
            Courses
          </Button>
          <Button
            color="inherit"
            startIcon={<Assignment />}
            onClick={() => handleNavigation('/admin/projects')}
          >
            Projects
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
            {user?.name || 'Admin'}
          </Typography>
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{ ml: 2 }}
          >
            <Avatar 
              alt={user?.name} 
              src={user?.profilePicture}
              sx={{ width: 32, height: 32 }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => handleNavigation('/admin/profile')}>
            <Avatar sx={{ width: 24, height: 24, mr: 2 }}>{user?.name?.charAt(0)}</Avatar>
            Profile
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/admin/settings')}>
            <Settings fontSize="small" sx={{ mr: 2 }} />
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <Logout fontSize="small" sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default AdminNavbar; 