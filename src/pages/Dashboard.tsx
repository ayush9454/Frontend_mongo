import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  DirectionsCar,
  AccessTime,
  AttachMoney,
  LocationOn,
  Event,
  Download,
  Cancel,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { parkingService } from '../services/api';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

interface Booking {
  _id: string;
  parkingSpace: {
    name: string;
    location: string;
    capacity: number;
  };
  spotNumber: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'cancelled';
  totalPrice: number;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const userId = localStorage.getItem('userId') || '';

  useEffect(() => {
    const fetchBookings = () => {
      parkingService.getBookings(userId)
        .then(res => setBookings(res.data))
        .catch(err => console.error('Failed to fetch bookings', err));
    };
    fetchBookings();
    const handleUpdate = () => fetchBookings();
    window.addEventListener('bookingUpdate', handleUpdate);
    return () => window.removeEventListener('bookingUpdate', handleUpdate);
  }, []);

  const calculateTotalSpent = () => {
    const validBookings = bookings.filter(b => 
      (b.status === 'active' || b.status === 'completed') && 
      typeof b.totalPrice === 'number' && 
      !isNaN(b.totalPrice)
    );
    return validBookings.reduce((total, booking) => total + booking.totalPrice, 0);
  };

  const stats = [
    {
      title: 'Active Bookings',
      value: bookings.filter(b => b.status === 'active').length,
      icon: <DirectionsCar sx={{ fontSize: 40 }} />,
      color: '#0078d4',
    },
    {
      title: 'Hours Parked',
      value: bookings.reduce((total, booking) => {
        const start = new Date(booking.startTime);
        const end = new Date(booking.endTime);
        return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }, 0).toFixed(1),
      icon: <AccessTime sx={{ fontSize: 40 }} />,
      color: '#0078d4',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 400,
      },
    },
  };

  const handleDownloadTicket = (booking: Booking) => {
    const ticketContent = `
Smart Parking Ticket
-------------------
Booking ID: ${booking._id}
Parking Lot: ${booking.parkingSpace?.name}
Location: ${booking.parkingSpace?.location}
Spot Number: ${booking.spotNumber}
Start Time: ${new Date(booking.startTime).toLocaleString()}
End Time: ${new Date(booking.endTime).toLocaleString()}
Amount: ₹${booking.totalPrice}
Status: ${booking.status}
    `;

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parking-ticket-${booking._id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCancelBooking = (bookingId: string) => {
    const updatedBookings = bookings.map(booking =>
      booking._id === bookingId
        ? { ...booking, status: 'cancelled' as const }
        : booking
    );
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    
    // Dispatch custom event for real-time update
    window.dispatchEvent(new CustomEvent('bookingUpdate'));
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ color: 'text.primary', mb: 4 }}
          >
            Dashboard
          </Typography>

          {/* Stats Section */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {stats.map((stat, index) => (
              <div key={index} style={{ width: '100%' }}>
                <MotionPaper
                  variants={itemVariants}
                  whileHover="hover"
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <Box sx={{ color: stat.color, mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ color: 'text.primary', mb: 1 }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: 'text.secondary' }}
                  >
                    {stat.title}
                  </Typography>
                </MotionPaper>
              </div>
            ))}
          </Grid>

          {/* Quick Actions */}
          <MotionBox variants={itemVariants}>
            <Typography
              variant="h5"
              component="h2"
              sx={{ color: 'text.primary', mb: 3 }}
            >
              Quick Actions
            </Typography>
            <Grid container spacing={3}>
              <div style={{ width: '100%' }}>
                <MotionPaper
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/parking-lots')}
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    cursor: 'pointer',
                    textAlign: 'center',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <DirectionsCar sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    Find Parking
                  </Typography>
                </MotionPaper>
              </div>
              <div style={{ width: '100%' }}>
                <MotionPaper
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/bookings')}
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    cursor: 'pointer',
                    textAlign: 'center',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <AccessTime sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    View Bookings
                  </Typography>
                </MotionPaper>
              </div>
            </Grid>
          </MotionBox>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Dashboard; 