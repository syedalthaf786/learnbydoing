import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, useTheme } from '@mui/material';
import {
  Dashboard,
  People,
  School,
  Assignment,
  Assessment,
  Settings,
} from '@mui/icons-material';
import { Outlet, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminNavbar from './AdminNavbar';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin/AdminDash' },
  { text: 'Users', icon: <People />, path: '/admin/users' },
  { text: 'Courses', icon: <School />, path: '/admin/courses' },
  { text: 'projects', icon: <Assignment />, path: '/admin/projects' },
  { text: 'Reports', icon: <Assessment />, path: '/admin/reports' },
  { text: 'Settings', icon: <Settings />, path: '/admin/settings' },
];

function AdminLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Protect admin routes
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminNavbar onToggleSidebar={handleToggleSidebar} />
      
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            ...(!sidebarOpen && {
              width: theme.spacing(7),
              overflowX: 'hidden',
            }),
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: sidebarOpen ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: sidebarOpen ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {sidebarOpen && <ListItemText primary={item.text} />}
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default AdminLayout; 