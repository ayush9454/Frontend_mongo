import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #635BFF 0%, #4B44C0 100%)',
          color: 'white',
          py: { xs: 6, sm: 8, md: 12 },
          px: { xs: 1, sm: 2 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 4, md: 6 },
              alignItems: 'center',
            }}
          >
            <Box sx={{ flex: 1, width: '100%' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  component="img"
                  src="/smart-parking-logo.svg"
                  alt="Smart Parking Logo"
                  sx={{
                    height: { xs: 32, sm: 40 },
                    mb: 3,
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
                    fontWeight: 700,
                    mb: 2,
                    lineHeight: 1.15,
                  }}
                >
                  Smart Parking Made Simple
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    fontWeight: 400,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    lineHeight: 1.5,
                  }}
                >
                  Find and book parking spots instantly. Save time and avoid the hassle of searching for parking.
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/parking-lots')}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      py: 1.5,
                      px: 3,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                  >
                    Find Parking
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      py: 1.5,
                      px: 3,
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </Box>
              </motion.div>
            </Box>
            <Box
              sx={{
                flex: { xs: 'none', md: 1 },
                width: '100%',
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src="/parking-illustration.svg"
                  alt="Smart Parking"
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    height: 'auto',
                  }}
                />
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8, md: 12 }, px: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            mb: { xs: 4, sm: 6 },
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
          }}
        >
          Why Choose Us?
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: { xs: 2.5, sm: 3, md: 4 },
          }}
        >
          {features.map((feature, index) => (
            <Box key={index} sx={{ minWidth: 0 }}>
              <MotionPaper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  height: '100%',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Box
                  component="img"
                  src={feature.icon}
                  alt={feature.title}
                  sx={{
                    width: 48,
                    height: 48,
                    mb: 2,
                  }}
                />
                <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 600, fontSize: { xs: '1.15rem', sm: '1.25rem' } }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  {feature.description}
                </Typography>
              </MotionPaper>
            </Box>
          ))}
        </Box>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 6, sm: 8, md: 10 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 640, mx: 'auto' }}>
            <Typography
              variant="h3"
              sx={{
                mb: 2,
                fontWeight: 700,
                fontSize: { xs: '1.6rem', sm: '2rem', md: '2.5rem' },
              }}
            >
              Ready to Get Started?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                lineHeight: 1.6,
              }}
            >
              Join thousands of users who are already using our smart parking system.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                py: 1.5,
                px: 4,
                width: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

const features = [
  {
    title: 'Real-time Availability',
    description: 'Check parking spot availability in real-time and book instantly. No more circling around looking for a spot.',
    icon: '/icons/real-time.svg',
  },
  {
    title: 'Secure Payments',
    description: 'Multiple payment options with secure transactions. Your payment information is always protected.',
    icon: '/icons/secure.svg',
  },
  {
    title: 'Easy Management',
    description: 'Manage your bookings, payments, and parking history all in one place. Stay organized and in control.',
    icon: '/icons/convenient.svg',
  },
];

export default Home; 