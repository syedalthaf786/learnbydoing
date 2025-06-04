import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Notifications,
  School,
  Assignment,
  Dashboard,
  Settings,
  Home,
  Code,
  Info,
  ContactSupport,
  Logout
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion'; // 🚀 Import Framer Motion
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const pages = [
  { name: 'Home', path: '/', icon: <Home /> },
  { name: 'Courses', path: '/courses', icon: <School /> },
  { name: 'Projects', path: '/projects', icon: <Code /> },
  { name: 'About', path: '/about', icon: <Info /> },
  { name: 'Contact', path: '/contact', icon: <ContactSupport /> }
];

const settings = [
  { name: 'Profile', path: '/profile', icon: <AccountCircle /> },
  { name: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
  { name: 'My Courses', path: '/enrolled-courses', icon: <School /> },
  { name: 'My Projects', path: '/projects', icon: <Assignment /> },
  { name: 'Settings', path: '/settings', icon: <Settings /> }
];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (path) => {
    handleCloseNavMenu();
    navigate(path);
  };

  const handleSettingClick = (path) => {
    handleCloseUserMenu();
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const RocketLogo = () => (
    <motion.div
      whileHover={{ y: -5, rotate: -10 }} // 🚀 Slight lift & tilt on hover
      whileTap={{ scale: 0.5 }} // 🚀 Shrinks slightly when clicked
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <RocketLaunchIcon sx={{ fontSize: 20, color: 'white' }} />
    </motion.div>
  );

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <RocketLogo />
            LearnByDoing
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={() => handleMenuClick(page.path)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {page.icon}
                    <Typography textAlign="center">{page.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LearnByDoing
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleMenuClick(page.path)}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 2
                }}
              >
                {page.icon}
                {page.name}
              </Button>
            ))}
          </Box>

          {user ? (
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                color="inherit"
                component={Link}
                to="/notifications"
              >
                <Notifications />
              </IconButton>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user?.displayName || user?.email || 'User'}
                    src={user?.photoURL}
                    sx={{ bgcolor: theme.palette.secondary.main }}
                  >
                    {user?.displayName?.[0] || user?.email?.[0] || ''}
                  </Avatar>

                </IconButton>
              </Tooltip >
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.name}
                    onClick={() => handleSettingClick(setting.path)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {setting.icon}
                      <Typography textAlign="center">{setting.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
                <MenuItem onClick={handleLogout}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Logout />
                    <Typography textAlign="center">Logout</Typography>
                  </Box>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={Link}
                to="/login"
                color="inherit"
                variant="outlined"
                startIcon={<AccountCircle />}
                sx={{
                  borderColor: 'white',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                color="inherit"
                variant="contained"
                startIcon={<AccountCircle />}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;