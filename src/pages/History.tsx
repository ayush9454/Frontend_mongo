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
  Card,
  CardContent,
  Button,
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
  }, [userId]);

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

  const handleDownloadReceipt = (booking: Booking) => {
    const receiptContent = `
Smart Parking Receipt
---------------------
Booking ID: ${booking._id}
Parking Lot: ${booking.parkingSpaceId?.name}
Location: ${booking.parkingSpaceId?.location}
Spot Number: ${booking.parkingId} (${booking.spotType})
Start Time: ${formatDateTime(booking.startTime)}
End Time: ${formatDateTime(booking.endTime)}
Amount Paid: ₹${booking.totalPrice}
Status: ${booking.status}
`;
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${booking._id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 2.5, sm: 4 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 2.5, sm: 4 },
            fontWeight: 700,
            fontSize: { xs: '1.65rem', sm: '2.125rem' },
            color: 'text.primary',
          }}
        >
          Booking History
        </Typography>

        {/* Mobile View: Cards */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
          {bookings.length === 0 && (
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              No booking history found.
            </Typography>
          )}
          {bookings.map((booking) => (
            <Card
              key={booking._id}
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, gap: 1 }}>
                  <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 600 }}>
                    {booking.parkingSpaceId?.name || 'Parking Space'}
                  </Typography>
                  <Chip
                    label={booking.status}
                    color={getStatusColor(booking.status)}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  <strong>ID:</strong> {booking._id}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  <strong>Spot:</strong> {booking.parkingId} ({booking.spotType})
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  <strong>Time:</strong> {formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5, pt: 1, borderTop: '1px solid #f0f0f0' }}>
                  <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 700 }}>
                    ₹{booking.totalPrice}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ReceiptIcon />}
                    onClick={() => handleDownloadReceipt(booking)}
                    disabled={booking.status === 'cancelled'}
                    sx={{
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      fontSize: '0.8rem',
                    }}
                  >
                    Receipt
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Desktop View: Table */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <MotionPaper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
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
                      <TableCell colSpan={10} align="center">
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
                          <span>
                            <IconButton
                              size="small"
                              color="primary"
                              disabled={booking.status === 'cancelled'}
                              onClick={() => handleDownloadReceipt(booking)}
                            >
                              <ReceiptIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MotionPaper>
        </Box>
      </Container>
    </Box>
  );
};

export default History; 