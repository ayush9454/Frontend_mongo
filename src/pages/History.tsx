import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { motion } from 'framer-motion';
import { parkingService } from '../services/api';

const MotionPaper = motion(Paper);

interface Booking {
  _id: string;
  parkingSpaceId: {
    name: string;
    location: string;
    capacity: number;
    pricePerHour?: number;
  };
  parkingId: string;
  spotType: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'cancelled' | 'confirmed';
  totalPrice: number;
}

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

const History: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const userId = localStorage.getItem('userId') || '';

  useEffect(() => {
    const fetchHistory = () => {
      parkingService.getBookingHistory(userId)
        .then(res => setBookings(res.data))
        .catch(err => console.error('Failed to fetch booking history', err));
    };
    fetchHistory();
    const handleUpdate = () => fetchHistory();
    window.addEventListener('bookingUpdate', handleUpdate);
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchHistory, 60000);
    return () => {
      window.removeEventListener('bookingUpdate', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDateTime = (dateTime: string) => {
    // Try to parse as date, fallback to original string if invalid
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Booking History
      </Typography>

      <MotionPaper
        elevation={0}
        sx={{
          p: 3,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Parking Lot</TableCell>
                <TableCell>Spot</TableCell>
                <TableCell>Spot Type</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Price/hr</TableCell>
                <TableCell>Receipt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No booking history found.
                  </TableCell>
                </TableRow>
              )}
              {bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking._id}</TableCell>
                  <TableCell>{booking.parkingSpaceId?.name}</TableCell>
                  <TableCell>{booking.parkingId}</TableCell>
                  <TableCell>{booking.spotType}</TableCell>
                  <TableCell>{formatDateTime(booking.startTime)}</TableCell>
                  <TableCell>{formatDateTime(booking.endTime)}</TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      color={getStatusColor(booking.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>₹{booking.totalPrice}</TableCell>
                  <TableCell>{booking.parkingSpaceId?.pricePerHour ? booking.parkingSpaceId.pricePerHour * getSpotTypeMultiplier(booking.spotType) : '-'}</TableCell>
                  <TableCell>
                    <Tooltip title="Download Receipt">
                      <IconButton
                        size="small"
                        color="primary"
                        disabled={booking.status === 'cancelled'}
                      >
                        <ReceiptIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MotionPaper>
    </Container>
  );
};

export default History; 