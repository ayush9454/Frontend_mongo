import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  DirectionsCar,
  AccessTime,
  LocationOn,
  Download,
  Cancel,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { parkingService } from '../services/api';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

interface Booking {
  _id: string;
  parkingSpaceId: {
    name: string;
    location: string;
    capacity: number;
    pricePerHour?: number;
    availableSpots: number;
  };
  parkingId: string;
  spotType: string;
  spotNumber: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'cancelled' | 'confirmed';
  totalPrice: number;
}

// Add a helper to get the multiplier for a spot type
const spotTypes = [
  { label: 'VIP', value: 'vip', multiplier: 2 },
  { label: 'Normal', value: 'normal', multiplier: 1 },
  { label: 'Car', value: 'car', multiplier: 1 },
  { label: 'Bike', value: 'bike', multiplier: 0.5 },
  { label: 'Handicapped', value: 'handicapped', multiplier: 0.8 },
  { label: 'Electric', value: 'electric', multiplier: 1.2 }
];
const getSpotTypeMultiplier = (type: string) => {
  const found = spotTypes.find(t => t.value === type);
  return found ? found.multiplier : 1;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    case 'confirmed':
      return 'info';
    case 'active':
      return 'primary';
    default:
      return 'default';
  }
};

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const userId = localStorage.getItem('userId') || '';

  useEffect(() => {
    const fetchBookings = () => {
      parkingService.getBookings(userId)
        .then(res => setBookings(res.data.filter((b: Booking) => b.status === 'active' || b.status === 'confirmed')))
        .catch(err => console.error('Failed to fetch bookings', err));
    };
    fetchBookings();
    const handleUpdate = () => fetchBookings();
    window.addEventListener('bookingUpdate', handleUpdate);
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchBookings, 60000);
    return () => {
      window.removeEventListener('bookingUpdate', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await parkingService.cancelBooking(bookingId);
      setBookings(prevBookings => prevBookings.filter(b => b._id !== bookingId));
    } catch (err) {
      console.error('Failed to cancel booking', err);
    }
  };

  const handleDownloadTicket = (booking: Booking) => {
    // Create ticket content
    const ticketContent = `
      Smart Parking Ticket
      -------------------
      Booking ID: ${booking._id}
      Parking Lot: ${booking.parkingSpaceId?.name}
      Address: ${booking.parkingSpaceId?.location}
      Spot Number: ${booking.spotNumber}
      Start Time: ${booking.startTime}
      End Time: ${booking.endTime}
      Total Amount: ₹${booking.totalPrice}
      Status: ${booking.status}
    `;
    // Create and download file
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parking-ticket-${booking._id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Add a helper function to format date/time
  const formatDateTime = (dateTime: string) => {
    const parsed = new Date(dateTime);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
    return dateTime;
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'text.primary', mb: 4 }}>
            My Bookings
          </Typography>
        </MotionBox>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Grid container spacing={3}>
            {bookings.length === 0 && (
              <Typography variant="body1" sx={{ color: 'text.secondary', ml: 2 }}>
                No active bookings.
              </Typography>
            )}
            {bookings.map((booking) => (
              <div key={booking._id} style={{ width: '100%' }}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{ bgcolor: 'background.paper', color: 'text.primary', border: '1px solid #e0e0e0', mb: 2 }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {booking.parkingSpaceId?.name}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Location: {booking.parkingSpaceId?.location}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Capacity: {booking.parkingSpaceId?.capacity}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Available: {booking.parkingSpaceId?.availableSpots} / {booking.parkingSpaceId?.capacity}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Spot Type: {booking.spotType}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Price per hour: ₹{booking.parkingSpaceId?.pricePerHour ? booking.parkingSpaceId.pricePerHour * getSpotTypeMultiplier(booking.spotType) : '-'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Spot Number: {booking.parkingId}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        ₹{booking.totalPrice}
                      </Typography>
                      <Chip
                        label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        color={getStatusColor(booking.status)}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Button
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={() => handleDownloadTicket(booking)}
                        sx={{ color: 'primary.main', borderColor: 'primary.main', '&:hover': { bgcolor: 'background.paper' } }}
                      >
                        Download
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => handleCancelBooking(booking._id)}
                        sx={{ ml: 2, borderColor: 'error.main', color: 'error.main', '&:hover': { bgcolor: 'background.paper' } }}
                      >
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Bookings; 