import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  LocalParking as ParkingIcon,
  BookOnline as BookingsIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Parking Lots', path: '/parking-lots', icon: <ParkingIcon /> },
    { label: 'My Bookings', path: '/bookings', icon: <BookingsIcon /> },
    { label: 'History', path: '/history', icon: <HistoryIcon /> },
  ];

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            cursor: 'pointer',
            color: 'primary.main',
            fontWeight: 700,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
          }}
          onClick={() => navigate('/')}
        >
          Smart Parking
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          {user ? (
            <>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  color={location.pathname === item.path ? 'primary' : 'inherit'}
                  variant={location.pathname === item.path ? 'contained' : 'text'}
                  size="small"
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </Button>
              ))}
              <Button color="error" variant="outlined" size="small" onClick={handleLogout} sx={{ ml: 1 }}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="primary" variant="contained" size="small" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </Box>

        {/* Mobile Hamburger Button */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            color="inherit"
            aria-label="open navigation menu"
            edge="end"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.paper',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
            Smart Parking
          </Typography>
          <IconButton onClick={handleDrawerToggle} size="small" aria-label="close drawer">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <List sx={{ flexGrow: 1 }}>
          {user ? (
            <>
              {navItems.map((item) => {
                const isSelected = location.pathname === item.path;
                return (
                  <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      onClick={() => handleNavClick(item.path)}
                      selected={isSelected}
                      sx={{
                        borderRadius: 2,
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'white',
                          '& .MuiListItemIcon-root': { color: 'white' },
                          '&:hover': { bgcolor: 'primary.dark' },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: isSelected ? 'white' : 'text.secondary', minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
              <Divider sx={{ my: 2 }} />
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 2,
                    color: 'error.main',
                    '&:hover': { bgcolor: 'error.lighter' },
                  }}
                >
                  <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavClick('/login')}
                sx={{
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 