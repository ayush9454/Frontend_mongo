import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
} from '@mui/material';
import { Search, DirectionsCar } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import BookingConfirmation from '../components/BookingConfirmation';
import { parkingService } from '../services/api';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

interface ParkingSpace {
  _id: string;
  name: string;
  location: string;
  capacity: number;
  availableSpots: number;
  pricePerHour: number;
}

const spotTypes = [
  { label: 'VIP', value: 'vip', multiplier: 2, prefix: 'A' },
  { label: 'Normal', value: 'normal', multiplier: 1, prefix: 'B' },
  { label: 'Car', value: 'car', multiplier: 1, prefix: 'C' },
  { label: 'Bike', value: 'bike', multiplier: 0.5, prefix: 'D' },
  { label: 'Electric', value: 'electric', multiplier: 1.2, prefix: 'E' }
];

const ParkingLots: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLot, setSelectedLot] = useState<any>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingDuration, setBookingDuration] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = localStorage.getItem('userId') || '';
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [paymentStep, setPaymentStep] = useState(false);
  const [spotType, setSpotType] = useState('normal');

  useEffect(() => {
    const fetchParkingSpaces = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await parkingService.getParkingSpaces();
        console.log('Parking spaces data:', response.data);
        if (response.data && Array.isArray(response.data)) {
          setParkingSpaces(response.data);
          console.log(`Loaded ${response.data.length} parking spaces`);
        } else {
          console.error('Invalid response format:', response.data);
          setError('Invalid data format received from server');
        }
      } catch (err: any) {
        console.error('Error fetching parking spaces:', err);
        setError(err.response?.data?.error || 'Failed to fetch parking spaces');
      } finally {
        setLoading(false);
      }
    };

    fetchParkingSpaces();
  }, []);

  const filteredLots = parkingSpaces.filter(
    (lot) =>
      lot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    console.log('Filtered parking lots:', filteredLots);
  }, [filteredLots]);

  const handleBookNow = (lot: any) => {
    setSelectedLot(lot);
    setBookingDialogOpen(true);
    setPaymentStep(false);
    setCardNumber('');
  };

  const getSpotTypeMultiplier = (type: string) => {
    const found = spotTypes.find(t => t.value === type);
    return found ? found.multiplier : 1;
  };

  const adjustedPrice = selectedLot ? selectedLot.pricePerHour * getSpotTypeMultiplier(spotType) : 0;

  const generateSpotNumber = (type: string) => {
    const found = spotTypes.find(t => t.value === type);
    const prefix = found ? found.prefix : 'X';
    const number = Math.floor(Math.random() * 100) + 1;
    return `${prefix}${number}`;
  };

  const handleConfirmBooking = async () => {
    if (!paymentStep) {
      setPaymentStep(true);
      return;
    }
    try {
      const bookingData = {
        parkingSpaceId: selectedLot._id,
        userId,
        parkingId: generateSpotNumber(spotType),
        spotType,
        startTime: new Date(),
        endTime: new Date(Date.now() + bookingDuration * 60 * 60 * 1000),
        totalPrice: adjustedPrice * bookingDuration,
        payment: {
          method: paymentMethod,
          cardNumber: paymentMethod === 'card' ? cardNumber : undefined,
          status: 'success',
        },
      };
      await parkingService.createBooking(bookingData);
      setBookingDialogOpen(false);
      setShowConfirmation(true);
      window.dispatchEvent(new CustomEvent('bookingUpdate'));
      const response = await parkingService.getParkingSpaces();
      setParkingSpaces(response.data);
    } catch (err) {
      setError('Failed to create booking');
    }
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

  if (showConfirmation && bookingDetails) {
    return <BookingConfirmation bookingDetails={bookingDetails} />;
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ color: 'text.primary', mb: 4 }}
          >
            Available Parking Lots
          </Typography>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search parking lots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              mb: 4,
              bgcolor: 'background.paper',
              borderRadius: 2,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#b3b3b3' }} />
                </InputAdornment>
              ),
            }}
          />
        </MotionBox>

        <Grid container spacing={3} component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
          {filteredLots.length === 0 ? (
            <Typography variant="body1" sx={{ ml: 2 }}>
              No parking spaces found.
            </Typography>
          ) : (
            filteredLots.map((lot) => (
              <Grid item xs={12} sm={6} md={4} key={lot._id}>
                <MotionCard
                  whileHover={{ y: -10 }}
                  sx={{
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    transition: 'transform 0.3s ease-in-out',
                  }}
                >
                  <CardContent>
                    <MotionBox
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                        {lot.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        Location: {lot.location}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        Available: {lot.availableSpots} / {lot.capacity}
                      </Typography>
                    </MotionBox>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Price:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        ₹{lot.pricePerHour}/hour
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Status:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {lot.availableSpots > 0 ? 'Available' : 'Full'}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<DirectionsCar />}
                      onClick={() => handleBookNow(lot)}
                      sx={{
                        bgcolor: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.dark'
                        }
                      }}
                      disabled={lot.availableSpots === 0}
                    >
                      Book Now
                    </Button>
                  </CardActions>
                </MotionCard>
              </Grid>
            ))
          )}
        </Grid>

        <AnimatePresence>
          {bookingDialogOpen && (
            <Dialog
              open={bookingDialogOpen}
              onClose={() => setBookingDialogOpen(false)}
              PaperProps={{
                sx: {
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                },
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <DialogTitle>Book Parking Space</DialogTitle>
                <DialogContent>
                  {!paymentStep ? (
                    <>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Spot Type</InputLabel>
                        <Select
                          value={spotType}
                          onChange={e => setSpotType(e.target.value)}
                          label="Spot Type"
                        >
                          {spotTypes.map(type => (
                            <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Duration (hours)</InputLabel>
                        <Select
                          value={bookingDuration}
                          onChange={e => setBookingDuration(Number(e.target.value))}
                          label="Duration (hours)"
                        >
                          {[1, 2, 3, 4, 5, 6, 8, 12, 24].map(hours => (
                            <MenuItem key={hours} value={hours}>
                              {hours} {hours === 1 ? 'hour' : 'hours'}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Price per hour: ₹{adjustedPrice}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Total Amount: ₹{adjustedPrice * bookingDuration}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Payment Method</InputLabel>
                        <Select
                          value={paymentMethod}
                          onChange={e => setPaymentMethod(e.target.value)}
                          label="Payment Method"
                        >
                          <MenuItem value="card">Credit/Debit Card</MenuItem>
                          <MenuItem value="upi">UPI</MenuItem>
                          <MenuItem value="cash">Cash</MenuItem>
                        </Select>
                      </FormControl>
                      {paymentMethod === 'card' && (
                        <TextField
                          fullWidth
                          label="Card Number"
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                          sx={{ mb: 2 }}
                        />
                      )}
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        (Fake payment for demo)
                      </Typography>
                    </>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setBookingDialogOpen(false)}
                    color="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmBooking}
                    variant="contained"
                    color="primary"
                  >
                    {paymentStep ? 'Pay & Confirm' : 'Next'}
                  </Button>
                </DialogActions>
              </motion.div>
            </Dialog>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default ParkingLots; 